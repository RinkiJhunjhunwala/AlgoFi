import { Request, Response } from 'express';
import { NFT } from '../models/NFT';
import { User } from '../models/User';
import { Transaction } from '../models/Transaction';
import { ipfsService } from '../config/ipfs';
import { ethers } from 'ethers';
import { config } from '../config/env';

export class NFTController {
  // Mint new NFT
  static async mintNFT(req: Request, res: Response) {
    try {
      const { walletAddress, name, description, category, purchasable, price, attributes } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Find or create user
      let user = await User.findOne({ walletAddress });
      if (!user) {
        user = await User.create({ walletAddress });
      }

      // Upload image to IPFS
      const imageCID = await ipfsService.uploadFile(file.buffer, file.originalname);

      // Create metadata
      const metadata = {
        name,
        description,
        image: imageCID,
        attributes: attributes || [],
      };

      // Upload metadata to IPFS
      const tokenURI = await ipfsService.uploadMetadata(metadata);

      // Here you would interact with the smart contract
      // For now, we'll simulate the minting

      const nft = await NFT.create({
        tokenId: Date.now(), // In real implementation, get from contract
        creator: user._id,
        owner: user._id,
        name,
        description,
        image: imageCID,
        tokenURI,
        category,
        purchasable,
        price: purchasable ? price : undefined,
        isListed: purchasable,
        attributes: attributes || [],
      });

      // Create transaction record
      await Transaction.create({
        txHash: `0x${Date.now().toString(16)}`, // Simulated hash
        from: user._id,
        nft: nft._id,
        type: 'mint',
        status: 'confirmed',
      });

      res.status(201).json({
        success: true,
        data: nft,
      });
    } catch (error) {
      console.error('Mint NFT error:', error);
      res.status(500).json({ error: 'Failed to mint NFT' });
    }
  }

  // Get all NFTs with pagination and filters
  static async getNFTs(req: Request, res: Response) {
    try {
      const { page = 1, limit = 12, category, purchasable, creator } = req.query;

      const filter: any = {};
      if (category) filter.category = category;
      if (purchasable !== undefined) filter.purchasable = purchasable === 'true';
      if (creator) {
        const user = await User.findOne({ walletAddress: creator });
        if (user) filter.creator = user._id;
      }

      const nfts = await NFT.find(filter)
        .populate('creator', 'walletAddress username avatar')
        .populate('owner', 'walletAddress username avatar')
        .sort({ createdAt: -1 })
        .limit(Number(limit) * 1)
        .skip((Number(page) - 1) * Number(limit));

      const total = await NFT.countDocuments(filter);

      res.json({
        success: true,
        data: nfts,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      console.error('Get NFTs error:', error);
      res.status(500).json({ error: 'Failed to fetch NFTs' });
    }
  }

  // Get single NFT by tokenId
  static async getNFT(req: Request, res: Response) {
    try {
      const { tokenId } = req.params;

      const nft = await NFT.findOne({ tokenId: Number(tokenId) })
        .populate('creator', 'walletAddress username avatar bio socialLinks')
        .populate('owner', 'walletAddress username avatar');

      if (!nft) {
        return res.status(404).json({ error: 'NFT not found' });
      }

      res.json({
        success: true,
        data: nft,
      });
    } catch (error) {
      console.error('Get NFT error:', error);
      res.status(500).json({ error: 'Failed to fetch NFT' });
    }
  }

  // Get NFTs by wallet address
  static async getNFTsByWallet(req: Request, res: Response) {
    try {
      const { walletAddress } = req.params;
      const { page = 1, limit = 12 } = req.query;

      const user = await User.findOne({ walletAddress });
      if (!user) {
        return res.json({
          success: true,
          data: [],
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total: 0,
            pages: 0,
          },
        });
      }

      const nfts = await NFT.find({ owner: user._id })
        .populate('creator', 'walletAddress username avatar')
        .populate('owner', 'walletAddress username avatar')
        .sort({ createdAt: -1 })
        .limit(Number(limit) * 1)
        .skip((Number(page) - 1) * Number(limit));

      const total = await NFT.countDocuments({ owner: user._id });

      res.json({
        success: true,
        data: nfts,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      console.error('Get NFTs by wallet error:', error);
      res.status(500).json({ error: 'Failed to fetch NFTs' });
    }
  }
}