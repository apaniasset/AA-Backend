import { Router } from 'express';
import { PermissionController as Permission } from '../controllers/PermissionController.js';
import { validate } from '../validators/userValidator.js';
import { masterSchema } from '../validators/masterValidator.js';

const router = Router();
router.post('/list', Permission.index);
router.post('/store', validate(masterSchema), Permission.store);
router.post('/show', Permission.show);
router.post('/update', validate(masterSchema), Permission.update);
router.post('/delete', Permission.destroy);

export default router;
