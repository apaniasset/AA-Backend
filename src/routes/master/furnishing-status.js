import { Router } from 'express';
import { FurnishingStatusController as FS } from '../controllers/FurnishingStatusController.js';
import { validate } from '../validators/userValidator.js';
import { masterSchema } from '../validators/masterValidator.js';

const router = Router();
router.post('/list', FS.index);
router.post('/store', validate(masterSchema), FS.store);
router.post('/show', FS.show);
router.post('/update', validate(masterSchema), FS.update);
router.post('/delete', FS.destroy);

export default router;
