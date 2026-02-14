import { Router } from 'express';
import { ConstructionStatusController as CS } from '../controllers/ConstructionStatusController.js';
import { validate } from '../validators/userValidator.js';
import { masterSchema } from '../validators/masterValidator.js';

const router = Router();
router.post('/list', CS.index);
router.post('/store', validate(masterSchema), CS.store);
router.post('/show', CS.show);
router.post('/update', validate(masterSchema), CS.update);
router.post('/delete', CS.destroy);

export default router;
