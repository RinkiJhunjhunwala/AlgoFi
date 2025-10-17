// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./AlgoMintNFT.sol";

contract Marketplace is ReentrancyGuard, Ownable {
    AlgoNFT public nftContract;
    
    uint256 public platformFee = 250; // 2.5%
    address public feeRecipient;
    
    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 price;
        bool isActive;
    }
    
    mapping(uint256 => Listing) public listings;
    
    event NFTListed(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price
    );
    
    event NFTSold(
        uint256 indexed tokenId,
        address indexed seller,
        address indexed buyer,
        uint256 price,
        uint256 fee
    );
    
    event NFTDelisted(
        uint256 indexed tokenId,
        address indexed seller
    );

    constructor(address _nftContract) {
        nftContract = AlgoNFT(_nftContract);
        feeRecipient = msg.sender;
    }
    
    function listNFT(uint256 tokenId, uint256 price) public {
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not owner");
        AlgoNFT.NFTData memory nftData = nftContract.getNFTData(tokenId);
        require(nftData.purchasable, "NFT not purchasable");
        
        listings[tokenId] = Listing({
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            isActive: true
        });
        
        emit NFTListed(tokenId, msg.sender, price);
    }
    
    function buyNFT(uint256 tokenId) public payable nonReentrant {
        Listing storage listing = listings[tokenId];
        require(listing.isActive, "NFT not listed");
        require(msg.value >= listing.price, "Insufficient payment");
        
        address seller = listing.seller;
        uint256 price = listing.price;
        uint256 fee = (price * platformFee) / 10000;
        uint256 sellerProceeds = price - fee;
        
        // Transfer NFT
        nftContract.safeTransferFrom(seller, msg.sender, tokenId);
        
        // Transfer funds
        payable(seller).transfer(sellerProceeds);
        payable(feeRecipient).transfer(fee);
        
        // Refund excess payment
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
        
        // Remove listing
        delete listings[tokenId];
        
        emit NFTSold(tokenId, seller, msg.sender, price, fee);
    }
    
    function delistNFT(uint256 tokenId) public {
        Listing storage listing = listings[tokenId];
        require(listing.seller == msg.sender, "Not seller");
        require(listing.isActive, "NFT not listed");
        
        delete listings[tokenId];
        
        emit NFTDelisted(tokenId, msg.sender);
    }
    
    function updatePlatformFee(uint256 _fee) public onlyOwner {
        require(_fee <= 1000, "Fee too high"); // Max 10%
        platformFee = _fee;
    }
    
    function updateFeeRecipient(address _recipient) public onlyOwner {
        require(_recipient != address(0), "Invalid address");
        feeRecipient = _recipient;
    }
    
    function getListing(uint256 tokenId) public view returns (Listing memory) {
        return listings[tokenId];
    }
    
    function isListed(uint256 tokenId) public view returns (bool) {
        return listings[tokenId].isActive;
    }
}