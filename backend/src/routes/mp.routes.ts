import { Router } from 'express';
import { MarketplaceController } from '../controllers/mp.controller';

const router = Router();

// Marketplace routes
router.get('/listings', MarketplaceController.getListings);
router.post('/list/:tokenId', MarketplaceController.listNFT);
router.post('/delist/:tokenId', MarketplaceController.delistNFT);

export { router as marketplaceRoutes };