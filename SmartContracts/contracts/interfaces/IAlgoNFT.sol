// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IAlgoNFT {
    struct NFTData {
        address creator;
        bool purchasable;
        uint256 price;
        bool isListed;
    }
    
    function mintNFT(
        address to,
        string memory tokenURI,
        bool purchasable,
        uint256 price
    ) external returns (uint256);
    
    function getNFTData(uint256 tokenId) external view returns (NFTData memory);
    
    function listNFT(uint256 tokenId, uint256 price) external;
    
    function unlistNFT(uint256 tokenId) external;
}