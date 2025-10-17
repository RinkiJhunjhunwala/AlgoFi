import { Request, Response } from 'express';
import { User } from '../models/User';
import { NFT } from '../models/NFT';

export class UserController {
  // Get user profile
  static async getProfile(req: Request, res: Response) {
    try {
      const { walletAddress } = req.params;

      const user = await User.findOne({ walletAddress });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get user's NFT stats
      const ownedNFTCount = await NFT.countDocuments({ owner: user._id });
      const createdNFTCount = await NFT.countDocuments({ creator: user._id });

      const profile = {
        ...user.toJSON(),
        stats: {
          ownedNFTs: ownedNFTCount,
          createdNFTs: createdNFTCount,
        },
      };

      res.json({
        success: true,
        data: profile,
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }

  // Update user profile
  static async updateProfile(req: Request, res: Response) {
    try {
      const { walletAddress } = req.params;
      const { username, email, bio, avatar, socialLinks } = req.body;

      const user = await User.findOneAndUpdate(
        { walletAddress },
        {
          username,
          email,
          bio,
          avatar,
          socialLinks,
        },
        { new: true, runValidators: true }
      );

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }

  // Get user's created NFTs
  static async getCreatedNFTs(req: Request, res: Response) {
    try {
      const { walletAddress } = req.params;
      const { page = 1, limit = 12 } = req.query;

      const user = await User.findOne({ walletAddress });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const nfts = await NFT.find({ creator: user._id })
        .populate('creator', 'walletAddress username avatar')
        .populate('owner', 'walletAddress username avatar')
        .sort({ createdAt: -1 })
        .limit(Number(limit) * 1)
        .skip((Number(page) - 1) * Number(limit));

      const total = await NFT.countDocuments({ creator: user._id });

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
      console.error('Get created NFTs error:', error);
      res.status(500).json({ error: 'Failed to fetch created NFTs' });
    }
  }
}