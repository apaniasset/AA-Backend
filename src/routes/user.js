import { Router } from 'express';
import { AuthController as Auth } from '../controllers/user/AuthController.js';
import { UserController as User } from '../controllers/user/UserController.js';

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
router.post('/list', User.index);
router.post('/create', User.store);
router.post('/show', User.show);
router.post('/update', User.update);
router.post('/delete', User.destroy);
router.post('/reset-password', User.resetPassword);
router.post('/update-status', User.updateStatus);
router.post('/change-password', User.changePassword);

export default router;
