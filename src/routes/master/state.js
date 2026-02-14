import { Router } from 'express';
import { StateController as State } from '../controllers/StateController.js';

const router = Router();
router.post('/list', State.index);
router.post('/store', State.store);
router.post('/show', State.show);
router.post('/update', State.update);
router.post('/delete', State.destroy);

export default router;
