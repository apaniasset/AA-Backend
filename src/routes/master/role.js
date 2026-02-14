import { Router } from 'express';
import { RoleController as Role } from '../controllers/RoleController.js';
import { validate } from '../validators/userValidator.js';
import { masterSchema } from '../validators/masterValidator.js';

const router = Router();
router.post('/list', Role.index);
router.post('/store', validate(masterSchema), Role.store);
router.post('/show', Role.show);
router.post('/update', validate(masterSchema), Role.update);
router.post('/delete', Role.destroy);

export default router;
