import { Router } from 'express';
import * as User from '../controllers/user.controller.js';
import * as Auth from '../controllers/user-auth.controller.js';
import { validate, userSchema } from '../validators/userValidator.js';
import { loginSchema } from '../validators/authValidator.js';

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

// --- Authentication ---

// Signup (Mobile OTP Only)
router.post('/register', Auth.sendRegistrationOTP);
router.post('/register-complete', Auth.completeRegistration);

// Login (Email/Phone + Password)
router.post('/login', validate(loginSchema), Auth.login);
router.post('/logout', Auth.logout);

// Forgot Password (Dual Channel)
router.post('/forgot-password', Auth.forgotPassword);
router.post('/reset-password', Auth.resetPassword);

// --- Management ---
router.post('/list', User.index);
router.post('/create', validate(userSchema), User.store);
router.post('/show', User.show);
router.post('/update', validate(userSchema), User.update);
router.post('/delete', User.destroy);
router.post('/update-status', User.updateStatus);
router.post('/change-password', User.changePassword);

export default router;
