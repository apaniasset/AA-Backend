import { Router } from 'express';
import * as Admin from '../controllers/admin.controller.js';
import * as Auth from '../controllers/admin-auth.controller.js';
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

// Authentication
router.post('/login', validate(loginSchema), Auth.login);
router.post('/logout', Auth.logout);

// Management
router.group('/users', (group) => {
    group.post('/list', Admin.index);
    group.post('/create', validate(userSchema), Admin.store);
    group.post('/show', Admin.show);
    group.post('/update', validate(userSchema), Admin.update);
    group.post('/delete', Admin.destroy);
    group.post('/update-status', Admin.updateStatus);
    group.post('/change-password', Admin.changePassword);
});

export default router;
