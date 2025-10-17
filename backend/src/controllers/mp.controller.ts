import { Request, Response } from 'express';
import { NFT } from '../models/NFT';
import { User } from '../models/User';
import { Transaction } from '../models/Transaction';

export class MarketplaceController {
  // Get marketplace listings
  static async getListings(req: Request, res: Response) {
    try {
      const { page = 1, limit = 12, category, minPrice, maxPrice, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

      const filter: any = {
        purchasable: true,
        isListed: true,
      };

      if (category) filter.category = category;
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }

      const sort: any = {};
      sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

      const nfts = await NFT.find(filter)
        .populate('creator', 'walletAddress username avatar')
        .populate('owner', 'walletAddress username avatar')
        .sort(sort)
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
      console.error('Get listings error:', error);
      res.status(500).json({ error: 'Failed to fetch listings' });
    }
  }

  // List NFT for sale
  static async listNFT(req: Request, res: Response) {
    try {
      const { tokenId } = req.params;
      const { price, walletAddress } = req.body;

      const user = await User.findOne({ walletAddress });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const nft = await NFT.findOne({ tokenId: Number(tokenId), owner: user._id });
      if (!nft) {
        return res.status(404).json({ error: 'NFT not found or not owned by user' });
      }

      if (!nft.purchasable) {
        return res.status(400).json({ error: 'NFT is not purchasable' });
      }

      nft.price = price;
      nft.isListed = true;
      await nft.save();

      // Create transaction record
      await Transaction.create({
        txHash: `0x${Date.now().toString(16)}`, // Simulated hash
        from: user._id,
        nft: nft._id,
        type: 'list',
        price,
        status: 'confirmed',
      });

      res.json({
        success: true,
        data: nft,
      });
    } catch (error) {
      console.error('List NFT error:', error);
      res.status(500).json({ error: 'Failed to list NFT' });
    }
  }

  // Delist NFT
  static async delistNFT(req: Request, res: Response) {
    try {
      const { tokenId } = req.params;
      const { walletAddress } = req.body;

      const user = await User.findOne({ walletAddress });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const nft = await NFT.findOne({ tokenId: Number(tokenId), owner: user._id });
      if (!nft) {
        return res.status(404).json({ error: 'NFT not found or not owned by user' });
      }

      nft.isListed = false;
      await nft.save();

      // Create transaction record
      await Transaction.create({
        txHash: `0x${Date.now().toString(16)}`, // Simulated hash
        from: user._id,
        nft: nft._id,
        type: 'delist',
        status: 'confirmed',
      });

      res.json({
        success: true,
        data: nft,
      });
    } catch (error) {
      console.error('Delist NFT error:', error);
      res.status(500).json({ error: 'Failed to delist NFT' });
    }
  }
}