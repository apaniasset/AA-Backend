import { Router } from 'express';
import { StatusController as Status } from '../controllers/StatusController.js';
import { validate } from '../validators/userValidator.js';
import { masterSchema } from '../validators/masterValidator.js';

const router = Router();
router.post('/list', Status.index);
router.post('/store', validate(masterSchema), Status.store);
router.post('/show', Status.show);
router.post('/update', validate(masterSchema), Status.update);
router.post('/delete', Status.destroy);

export default router;
