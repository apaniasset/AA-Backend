import { Router } from 'express';
import { SubLocalityController as SL } from '../controllers/SubLocalityController.js';

const router = Router();
router.post('/list', SL.index);
router.post('/store', SL.store);
router.post('/show', SL.show);
router.post('/update', SL.update);
router.post('/delete', SL.destroy);

export default router;
