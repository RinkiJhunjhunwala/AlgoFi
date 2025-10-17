import { NFTStorage, File } from 'nft.storage';
import { config } from './env';

export class IPFSService {
  private client: NFTStorage;

  constructor() {
    this.client = new NFTStorage({ token: config.nftStorageKey });
  }

  async uploadFile(file: Buffer, filename: string): Promise<string> {
    try {
      const nftStorageFile = new File([file], filename);
      const cid = await this.client.storeBlob(nftStorageFile);
      return `ipfs://${cid}`;
    } catch (error) {
      console.error('IPFS upload error:', error);
      throw new Error('Failed to upload file to IPFS');
    }
  }

  async uploadMetadata(metadata: {
    name: string;
    description: string;
    image: string;
    attributes?: Array<{ trait_type: string; value: string }>;
  }): Promise<string> {
    try {
      const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
      const cid = await this.client.storeBlob(blob);
      return `ipfs://${cid}`;
    } catch (error) {
      console.error('IPFS metadata upload error:', error);
      throw new Error('Failed to upload metadata to IPFS');
    }
  }
}

export const ipfsService = new IPFSService();