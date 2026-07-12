import { Router } from 'express';
import { MaintenanceController } from './maintenance.controller';

const router = Router();
const controller = new MaintenanceController();

router.post('/', controller.create);
router.get('/', controller.getAll);
router.post('/:id/approve', controller.approve);
router.post('/:id/assign', controller.assign);
router.post('/:id/resolve', controller.resolve);

export default router;
