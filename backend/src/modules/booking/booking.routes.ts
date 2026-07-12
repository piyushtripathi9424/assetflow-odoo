import { Router } from 'express';
import { BookingController } from './booking.controller';

const router = Router();
const bookingController = new BookingController();

router.post('/', bookingController.create);
router.post('/:id/approve', bookingController.approve);
router.post('/:id/cancel', bookingController.cancel);
router.get('/asset/:assetId', bookingController.getForAsset);

export default router;
