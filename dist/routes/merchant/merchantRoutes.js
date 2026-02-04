import { Router } from 'express';
import { MerchantController } from '../../controllers/merchant/MerchantController.js';
const router = Router();
router.post('/', MerchantController.add);
router.get('/', MerchantController.list);
router.get('/:id', MerchantController.show);
router.put('/:id', MerchantController.update);
router.delete('/:id', MerchantController.delete);
export default router;
