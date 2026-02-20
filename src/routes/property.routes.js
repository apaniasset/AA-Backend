import { Router } from 'express';
import * as PropertyController from '../controllers/property.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

const auth = authMiddleware(['user', 'merchant', 'admin']);

router.get('/properties', index);
router.get('/:id', PropertyController.show);
router.post('/', auth, PropertyController.store);
router.put('/:id', auth, PropertyController.update);
router.delete('/:id', auth, PropertyController.destroy);

export default router;
