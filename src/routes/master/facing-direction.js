import { Router } from 'express';
import { FacingDirectionController as FD } from '../controllers/FacingDirectionController.js';
import { validate } from '../validators/userValidator.js';
import { masterSchema } from '../validators/masterValidator.js';

const router = Router();
router.post('/list', FD.index);
router.post('/store', validate(masterSchema), FD.store);
router.post('/show', FD.show);
router.post('/update', validate(masterSchema), FD.update);
router.post('/delete', FD.destroy);

export default router;
