const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AlgoMintMarketplace", function () {
  let AlgoMintNFT;
  let AlgoMintMarketplace;
  let nft;
  let marketplace;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    // Deploy NFT contract
    AlgoMintNFT = await ethers.getContractFactory("AlgoMintNFT");
    nft = await AlgoMintNFT.deploy();
    await nft.deployed();

    // Deploy Marketplace contract
    AlgoMintMarketplace = await ethers.getContractFactory("AlgoMintMarketplace");
    marketplace = await AlgoMintMarketplace.deploy(nft.address);
    await marketplace.deployed();

    // Transfer ownership of NFT contract to marketplace for testing
    await nft.transferOwnership(marketplace.address);
  });

  describe("Deployment", function () {
    it("Should set the right NFT contract address", async function () {
      expect(await marketplace.nftContract()).to.equal(nft.address);
    });

    it("Should set the right fee recipient", async function () {
      expect(await marketplace.feeRecipient()).to.equal(owner.address);
    });

    it("Should set the right platform fee", async function () {
      expect(await marketplace.platformFee()).to.equal(250); // 2.5%
    });
  });

  describe("Listing", function () {
    beforeEach(async function () {
      await nft.connect(addr1).mintNFT(addr1.address, "ipfs://test1", true, ethers.utils.parseEther("1.0"));
    });

    it("Should list an NFT", async function () {
      const price = ethers.utils.parseEther("2.0");
      
      await expect(marketplace.connect(addr1).listNFT(0, price))
        .to.emit(marketplace, "NFTListed")
        .withArgs(0, addr1.address, price);

      const listing = await marketplace.getListing(0);
      expect(listing.tokenId).to.equal(0);
      expect(listing.seller).to.equal(addr1.address);
      expect(listing.price).to.equal(price);
      expect(listing.isActive).to.equal(true);
    });

    it("Should not allow non-owner to list", async function () {
      await expect(
        marketplace.connect(addr2).listNFT(0, ethers.utils.parseEther("1.0"))
      ).to.be.revertedWith("Not owner");
    });
  });

  describe("Buying", function () {
    beforeEach(async function () {
      await nft.connect(addr1).mintNFT(addr1.address, "ipfs://test1", true, ethers.utils.parseEther("1.0"));
      await nft.connect(addr1).approve(marketplace.address, 0);
      await marketplace.connect(addr1).listNFT(0, ethers.utils.parseEther("1.0"));
    });

    it("Should buy an NFT", async function () {
      const price = ethers.utils.parseEther("1.0");
      const fee = price.mul(250).div(10000); // 2.5% fee
      const sellerProceeds = price.sub(fee);

      await expect(
        marketplace.connect(addr2).buyNFT(0, { value: price })
      ).to.emit(marketplace, "NFTSold")
        .withArgs(0, addr1.address, addr2.address, price, fee);

      expect(await nft.ownerOf(0)).to.equal(addr2.address);
      
      // Check if listing is removed
      const listing = await marketplace.getListing(0);
      expect(listing.isActive).to.equal(false);
    });

    it("Should not allow buying with insufficient payment", async function () {
      await expect(
        marketplace.connect(addr2).buyNFT(0, { value: ethers.utils.parseEther("0.5") })
      ).to.be.revertedWith("Insufficient payment");
    });

    it("Should not allow buying inactive listing", async function () {
      await marketplace.connect(addr1).delistNFT(0);
      
      await expect(
        marketplace.connect(addr2).buyNFT(0, { value: ethers.utils.parseEther("1.0") })
      ).to.be.revertedWith("NFT not listed");
    });
  });

  describe("Delisting", function () {
    beforeEach(async function () {
      await nft.connect(addr1).mintNFT(addr1.address, "ipfs://test1", true, ethers.utils.parseEther("1.0"));
      await marketplace.connect(addr1).listNFT(0, ethers.utils.parseEther("1.0"));
    });

    it("Should delist an NFT", async function () {
      await expect(marketplace.connect(addr1).delistNFT(0))
        .to.emit(marketplace, "NFTDelisted")
        .withArgs(0, addr1.address);

      const listing = await marketplace.getListing(0);
      expect(listing.isActive).to.equal(false);
    });

    it("Should not allow non-seller to delist", async function () {
      await expect(
        marketplace.connect(addr2).delistNFT(0)
      ).to.be.revertedWith("Not seller");
    });
  });
});