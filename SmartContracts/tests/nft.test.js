const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AlgoMintNFT", function () {
  let AlgoMintNFT;
  let nft;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    AlgoMintNFT = await ethers.getContractFactory("AlgoMintNFT");
    nft = await AlgoMintNFT.deploy();
    await nft.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await nft.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await nft.name()).to.equal("AlgoMintNFT");
      expect(await nft.symbol()).to.equal("ALGONFT");
    });
  });

  describe("Minting", function () {
    it("Should mint a new NFT", async function () {
      const tokenURI = "ipfs://test";
      
      await expect(nft.mintNFT(addr1.address, tokenURI, true, ethers.utils.parseEther("1.0")))
        .to.emit(nft, "NFTMinted")
        .withArgs(owner.address, 0, tokenURI, true, ethers.utils.parseEther("1.0"));

      expect(await nft.ownerOf(0)).to.equal(addr1.address);
      expect(await nft.tokenURI(0)).to.equal(tokenURI);
      
      const nftData = await nft.getNFTData(0);
      expect(nftData.creator).to.equal(owner.address);
      expect(nftData.purchasable).to.equal(true);
      expect(nftData.price).to.equal(ethers.utils.parseEther("1.0"));
      expect(nftData.isListed).to.equal(true);
    });

    it("Should not mint with empty token URI", async function () {
      await expect(
        nft.mintNFT(addr1.address, "", true, ethers.utils.parseEther("1.0"))
      ).to.be.revertedWith("Token URI cannot be empty");
    });
  });

  describe("Listing", function () {
    beforeEach(async function () {
      await nft.mintNFT(owner.address, "ipfs://test1", true, ethers.utils.parseEther("1.0"));
    });

    it("Should list an NFT", async function () {
      const newPrice = ethers.utils.parseEther("2.0");
      
      await expect(nft.listNFT(0, newPrice))
        .to.emit(nft, "NFTListed")
        .withArgs(0, newPrice, owner.address);

      const nftData = await nft.getNFTData(0);
      expect(nftData.price).to.equal(newPrice);
      expect(nftData.isListed).to.equal(true);
    });

    it("Should not allow non-owner to list", async function () {
      await expect(
        nft.connect(addr1).listNFT(0, ethers.utils.parseEther("2.0"))
      ).to.be.revertedWith("Not owner");
    });

    it("Should not allow listing non-purchasable NFT", async function () {
      await nft.mintNFT(owner.address, "ipfs://test2", false, 0);
      
      await expect(
        nft.listNFT(1, ethers.utils.parseEther("1.0"))
      ).to.be.revertedWith("NFT not purchasable");
    });
  });

  describe("Unlisting", function () {
    beforeEach(async function () {
      await nft.mintNFT(owner.address, "ipfs://test1", true, ethers.utils.parseEther("1.0"));
    });

    it("Should unlist an NFT", async function () {
      await expect(nft.unlistNFT(0))
        .to.emit(nft, "NFTUnlisted")
        .withArgs(0, owner.address);

      const nftData = await nft.getNFTData(0);
      expect(nftData.isListed).to.equal(false);
    });

    it("Should not allow non-owner to unlist", async function () {
      await expect(
        nft.connect(addr1).unlistNFT(0)
      ).to.be.revertedWith("Not owner");
    });
  });
});