import { Router } from 'express';
import { BhkTypeController as BHK } from '../controllers/BhkTypeController.js';
import { validate } from '../validators/userValidator.js';
import { masterSchema } from '../validators/masterValidator.js';

const router = Router();
router.post('/list', BHK.index);
router.post('/store', validate(masterSchema), BHK.store);
router.post('/show', BHK.show);
router.post('/update', validate(masterSchema), BHK.update);
router.post('/delete', BHK.destroy);

export default router;
