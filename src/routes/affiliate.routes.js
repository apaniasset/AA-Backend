import { Router } from 'express';
import * as Affiliate from '../controllers/affiliate.controller.js';
import * as Auth from '../controllers/affiliate-auth.controller.js';
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

// Signup (Single Step - No OTP)
router.post('/register', Auth.register);

// Login (Email/Phone + Password)
router.post('/login', validate(loginSchema), Auth.login);
router.post('/logout', Auth.logout);

// Forgot Password (Dual Channel)
router.post('/forgot-password', Auth.forgotPassword);
router.post('/reset-password', Auth.resetPassword);

// --- Management ---
router.post('/list', Affiliate.index);
router.post('/create', validate(userSchema), Affiliate.store);
router.post('/show', Affiliate.show);
router.post('/update', validate(userSchema), Affiliate.update);
router.post('/delete', Affiliate.destroy);

export default router;
