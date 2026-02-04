import { Router } from 'express';
import { AdminController } from '../../controllers/admin/AdminController.js';

const router = Router();

router.post('/', AdminController.add);
router.get('/', AdminController.list);
router.get('/:id', AdminController.show);
router.put('/:id', AdminController.update);
router.delete('/:id', AdminController.delete);

export default router;
