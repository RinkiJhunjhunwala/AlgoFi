import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();

// User routes
router.get('/:walletAddress', UserController.getProfile);
router.put('/:walletAddress', UserController.updateProfile);
router.get('/:walletAddress/created', UserController.getCreatedNFTs);

export { router as userRoutes };