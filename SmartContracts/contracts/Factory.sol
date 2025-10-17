// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./AlgoNFT.sol";
import "./Marketplace.sol";

contract Factory{
    AlgoNFT public nftContract;
    Marketplace public mp;

    event CollectionCreated(address index creator, address collection);

    constructor(){
        nftContract = new AlgoNFT();
        mp = new Marketplace(address(nftContract));

        // transfer ownership to deployer
        nftContract.transferOwnership(msg.sender);
        mp.transferOwnership(msg.sender);
    }
    function mintNFT(
        string memory tokenURI,
        bool purchasable,
        uint256 price
    ) public returns (uint256){
        uint256 tokenId = nftContract.mintNFT(
            msg.sender,
            tokenURI,
            purchasable,
            price
        );
        return tokenId;
    }
    function listNFT(uint256 tokenId,uint256 price) public{
        mp.listNFT(tokenId,price);
    }
    function getContracts() public view returns (address, address){
        return(address(nftContract),address(mp));
    }
}