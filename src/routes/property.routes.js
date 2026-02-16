import { Router } from 'express';
import * as PropertyController from '../controllers/property.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', PropertyController.index);
router.get('/:id', PropertyController.show);
router.post('/', authMiddleware(['merchant', 'admin']), PropertyController.store);
router.put('/:id', authMiddleware(['merchant', 'admin']), PropertyController.update);
router.delete('/:id', authMiddleware(['merchant', 'admin']), PropertyController.destroy);

export default router;
