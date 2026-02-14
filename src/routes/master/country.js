import { Router } from 'express';
import { CountryController as Country } from '../controllers/CountryController.js';

const router = Router();
router.post('/list', Country.index);
router.post('/store', Country.store);
router.post('/show', Country.show);
router.post('/update', Country.update);
router.post('/delete', Country.destroy);

export default router;
