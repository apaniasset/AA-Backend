import { Router } from 'express';
import { PackageController as PKG } from '../controllers/PackageController.js';
import { validate } from '../validators/userValidator.js';
import { masterSchema } from '../validators/masterValidator.js';

const router = Router();
router.post('/list', PKG.index);
router.post('/store', validate(masterSchema), PKG.store);
router.post('/show', PKG.show);
router.post('/update', validate(masterSchema), PKG.update);
router.post('/delete', PKG.destroy);

export default router;
