import { Router } from 'express';
import { AuthController as Auth } from '../controllers/merchant/AuthController.js';
import { MerchantController as Merchant } from '../controllers/merchant/MerchantController.js';

const router = Router();

// Laravel-style Group Helper
const addGroupHelper = (r) => {
    r.group = function (prefix, callback) {
        const subRouter = Router();
        addGroupHelper(subRouter);
        callback(subRouter);
        r.use(prefix, subRouter);
    };
};
addGroupHelper(router);

// Auth
router.post('/login', Auth.login);
router.post('/logout', Auth.logout);
router.post('/forgot-password', Auth.forgotPassword);
router.post('/reset-password', Auth.resetPassword);
router.post('/send-otp', Auth.sendLoginOTP);
router.post('/login-otp', Auth.loginWithOTP);

// Management
router.post('/list', Merchant.index);
router.post('/create', Merchant.store);
router.post('/show', Merchant.show);
router.post('/update', Merchant.update);
router.post('/delete', Merchant.destroy);

export default router;
