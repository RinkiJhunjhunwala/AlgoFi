import { ethers } from 'ethers';
import { config } from '../config/env';
import { NFT } from '../models/NFT';
import { User } from '../models/User';

export class NFTService {
  private provider: ethers.providers.JsonRpcProvider;
  private wallet: ethers.Wallet;

  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(config.algorandEvmRpc);
    this.wallet = new ethers.Wallet(config.privateKey, this.provider);
  }

  async syncNFTMintEvent(txHash: string, tokenId: number) {
    try {
      // This would listen to blockchain events and sync with database
      // For now, it's a placeholder for the actual implementation
      console.log(`Syncing NFT mint event: ${txHash}, tokenId: ${tokenId}`);
    } catch (error) {
      console.error('Sync NFT mint event error:', error);
    }
  }

  async updateNFTListing(tokenId: number, isListed: boolean, price?: number) {
    try {
      const nft = await NFT.findOne({ tokenId });
      if (nft) {
        nft.isListed = isListed;
        if (price !== undefined) {
          nft.price = price;
        }
        await nft.save();
      }
    } catch (error) {
      console.error('Update NFT listing error:', error);
    }
  }

  async transferNFT(tokenId: number, fromAddress: string, toAddress: string) {
    try {
      const fromUser = await User.findOne({ walletAddress: fromAddress });
      const toUser = await User.findOne({ walletAddress: toAddress });
      const nft = await NFT.findOne({ tokenId });

      if (fromUser && toUser && nft) {
        nft.owner = toUser._id;
        nft.isListed = false;
        await nft.save();
      }
    } catch (error) {
      console.error('Transfer NFT error:', error);
    }
  }
}

export const nftService = new NFTService();