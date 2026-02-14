import { Router } from 'express';
import { LocalityController as Locality } from '../controllers/LocalityController.js';

const router = Router();
router.post('/list', Locality.index);
router.post('/store', Locality.store);
router.post('/show', Locality.show);
router.post('/update', Locality.update);
router.post('/delete', Locality.destroy);

export default router;
