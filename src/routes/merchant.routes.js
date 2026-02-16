import { Router } from 'express';
import * as Merchant from '../controllers/merchant.controller.js';
import * as Auth from '../controllers/merchant-auth.controller.js';
import { validate, userSchema } from '../validators/userValidator.js';
import { loginSchema } from '../validators/authValidator.js';
import * as Prop from '../controllers/merchant-property.controller.js';
import * as MainProp from '../controllers/property.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

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
router.post('/list', Merchant.index);
router.post('/create', validate(userSchema), Merchant.store);
router.post('/show', Merchant.show);
router.post('/update', validate(userSchema), Merchant.update);
router.post('/delete', Merchant.destroy);

// Apply auth to all merchant routes
const auth = authMiddleware(['merchant']);

// Property Management (Merchant Specific)
router.get('/my-properties', auth, Prop.myProperties);
router.post('/add-property', auth, MainProp.store);
router.post('/edit-property/:id', auth, MainProp.update);
router.post('/delete-property/:id', auth, MainProp.destroy);
router.post('/toggle-favorite', auth, Prop.toggleFavorite);

export default router;
