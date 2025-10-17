// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzepplin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721, ERC721URIStorage , Ownable{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter';

    struct NFTData{
        address creator;
        bool purchasable;
        uint256 price;
        bool isListed  
    }

    mapping(uint256 => NFTData) public nftData;

    event NFTMinted(
        address indexed creator;
        uint256 indexed tokenId;
        string tokenURI,
        bool purchaseble;
        uint256 price
    );
    event NFTListed(
        uint256 indexed tokenIDd,
        address indexed seller
    )

    constructor() ERC721("AlgoNFT", "ALGONFT") {}

    function mintNFT(
        address to,
        string memory tokenURI,
        bool purchasable,
        uint256 price
    ) 
        public returns (uint256) {
        require(bytes(tokenURI).length > 0, "Token URI cannot be empty");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        nftData[tokenId] = NFTData({
            creator: msg.sender,
            purchasable: purchasable,
            price: price,
            isListed: purchasable
        });
        
        emit NFTMinted(msg.sender, tokenId, tokenURI, purchasable, price);
        
        if (purchasable) {
            emit NFTListed(tokenId, price, msg.sender);
        }
        
        return tokenId;
    }
    
    function listNFT(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(nftData[tokenId].purchasable, "NFT not purchasable");
        
        nftData[tokenId].price = price;
        nftData[tokenId].isListed = true;
        
        emit NFTListed(tokenId, price, msg.sender);
    }
    
    function unlistNFT(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(nftData[tokenId].isListed, "NFT not listed");
        
        nftData[tokenId].isListed = false;
        
        emit NFTUnlisted(tokenId, msg.sender);
    }
    
    function getNFTData(uint256 tokenId) public view returns (NFTData memory) {
        return nftData[tokenId];
    }
    
    // Override functions
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
}