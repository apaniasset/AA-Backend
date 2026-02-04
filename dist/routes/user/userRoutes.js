import { Router } from 'express';
import { UserController } from '../../controllers/user/UserController.js';
const router = Router();
router.post('/', UserController.add);
router.get('/', UserController.list);
router.get('/:id', UserController.show);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);
export default router;
