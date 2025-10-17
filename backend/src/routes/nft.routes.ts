import { Router } from 'express';
import { NFTController } from '../controllers/nft.controller';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// NFT routes
router.post('/mint', upload.single('file'), NFTController.mintNFT);
router.get('/', NFTController.getNFTs);
router.get('/:tokenId', NFTController.getNFT);
router.get('/wallet/:walletAddress', NFTController.getNFTsByWallet);

export { router as nftRoutes };