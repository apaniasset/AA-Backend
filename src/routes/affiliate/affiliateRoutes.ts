import { Router } from 'express';
import { AffiliateController } from '../../controllers/affiliate/AffiliateController.js';

const router = Router();

router.post('/', AffiliateController.add);
router.get('/', AffiliateController.list);
router.get('/:id', AffiliateController.show);
router.put('/:id', AffiliateController.update);
router.delete('/:id', AffiliateController.delete);

export default router;
