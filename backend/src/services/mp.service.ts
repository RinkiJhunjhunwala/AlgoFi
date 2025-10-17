import { ethers } from 'ethers';
import { config } from '../config/env';
import { NFT } from '../models/NFT';
import { User } from '../models/User';
import { Transaction } from '../models/Transaction';

export class MarketplaceService {
  private provider: ethers.providers.JsonRpcProvider;
  private wallet: ethers.Wallet;

  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(config.algorandEvmRpc);
    this.wallet = new ethers.Wallet(config.privateKey, this.provider);
  }

  async syncSaleEvent(txHash: string, tokenId: number, buyer: string, price: string) {
    try {
      const nft = await NFT.findOne({ tokenId });
      const buyerUser = await User.findOne({ walletAddress: buyer.toLowerCase() });
      
      if (nft && buyerUser) {
        // Update NFT ownership
        nft.owner = buyerUser._id;
        nft.isListed = false;
        await nft.save();

        // Create sale transaction
        await Transaction.create({
          txHash,
          from: nft.owner, // previous owner
          to: buyerUser._id,
          nft: nft._id,
          type: 'sale',
          price: parseFloat(price),
          status: 'confirmed',
        });
      }
    } catch (error) {
      console.error('Sync sale event error:', error);
    }
  }

  async syncListEvent(tokenId: number, price: string) {
    try {
      const nft = await NFT.findOne({ tokenId });
      if (nft) {
        nft.isListed = true;
        nft.price = parseFloat(price);
        await nft.save();
      }
    } catch (error) {
      console.error('Sync list event error:', error);
    }
  }

  async syncDelistEvent(tokenId: number) {
    try {
      const nft = await NFT.findOne({ tokenId });
      if (nft) {
        nft.isListed = false;
        await nft.save();
      }
    } catch (error) {
      console.error('Sync delist event error:', error);
    }
  }

  async getMarketplaceStats() {
    try {
      const totalListed = await NFT.countDocuments({ 
        purchasable: true, 
        isListed: true 
      });
      
      const totalVolumeResult = await Transaction.aggregate([
        { $match: { type: 'sale', status: 'confirmed' } },
        { $group: { _id: null, totalVolume: { $sum: '$price' } } }
      ]);

      const recentSales = await Transaction.find({ 
        type: 'sale', 
        status: 'confirmed' 
      })
      .populate('nft')
      .populate('from', 'walletAddress username')
      .populate('to', 'walletAddress username')
      .sort({ createdAt: -1 })
      .limit(10);

      return {
        totalListed,
        totalVolume: totalVolumeResult[0]?.totalVolume || 0,
        recentSales,
      };
    } catch (error) {
      console.error('Get marketplace stats error:', error);
      throw error;
    }
  }
}

export const marketplaceService = new MarketplaceService();