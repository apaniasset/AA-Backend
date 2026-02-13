import { Router } from 'express';
import { AuthController as Auth } from '../controllers/affiliate/AuthController.js';
import { AffiliateController as Affiliate } from '../controllers/affiliate/AffiliateController.js';

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

// Management
router.post('/list', Affiliate.index);
router.post('/create', Affiliate.store);
router.post('/show', Affiliate.show);
router.post('/update', Affiliate.update);
router.post('/delete', Affiliate.destroy);

export default router;
