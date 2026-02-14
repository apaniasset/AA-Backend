import { Router } from 'express';
import { CityController as City } from '../controllers/CityController.js';

const router = Router();
router.post('/list', City.index);
router.post('/store', City.store);
router.post('/show', City.show);
router.post('/update', City.update);
router.post('/delete', City.destroy);

export default router;
