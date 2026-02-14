import { Router } from 'express';
import { listing_typesController as ListingType } from '../controllers/ListingTypeController.js';
// Wait, I named it ListingTypeController
import { ListingTypeController as LT } from '../controllers/ListingTypeController.js';
import { validate } from '../validators/userValidator.js';
import { masterSchema } from '../validators/masterValidator.js';

const router = Router();
router.post('/list', LT.index);
router.post('/store', validate(masterSchema), LT.store);
router.post('/show', LT.show);
router.post('/update', validate(masterSchema), LT.update);
router.post('/delete', LT.destroy);

export default router;
