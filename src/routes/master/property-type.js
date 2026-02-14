import { Router } from 'express';
import { PropertyTypeController as PT } from '../controllers/PropertyTypeController.js';
import { validate } from '../validators/userValidator.js';
import { masterSchema } from '../validators/masterValidator.js';

const router = Router();
router.post('/list', PT.index);
router.post('/store', validate(masterSchema), PT.store);
router.post('/show', PT.show);
router.post('/update', validate(masterSchema), PT.update);
router.post('/delete', PT.destroy);

export default router;
