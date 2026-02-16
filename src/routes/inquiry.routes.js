import { Router } from 'express';
import * as PropertyInquiryController from '../controllers/inquiry.controller.js';

const router = Router();

router.post('/', PropertyInquiryController.store);
router.post('/log-view/:propertyId', PropertyInquiryController.logView);

export default router;
