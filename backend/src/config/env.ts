import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/algomint',
  ipfsApiKey: process.env.IPFS_API_KEY || '',
  nftStorageKey: process.env.NFT_STORAGE_KEY || '',
  algorandEvmRpc: process.env.ALGORAND_EVM_RPC || 'https://testnet-api.algonode.cloud',
  contractAddresses: {
    nft: process.env.NFT_CONTRACT_ADDRESS || '',
    marketplace: process.env.MARKETPLACE_CONTRACT_ADDRESS || '',
    factory: process.env.FACTORY_CONTRACT_ADDRESS || '',
  },
  privateKey: process.env.PRIVATE_KEY || '',
  jwtSecret: process.env.JWT_SECRET || 'algomint-secret',
};