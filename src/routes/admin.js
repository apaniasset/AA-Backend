import { UserController as User } from '../controllers/UserController.js';
import { validate, userSchema } from '../validators/userValidator.js';

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

// Management
router.group('/users', (group) => {
    group.post('/list', User.index);
    group.post('/create', validate(userSchema), User.store);
    group.post('/show', User.show);
    group.post('/update', validate(userSchema), User.update);
    group.post('/delete', User.destroy);
    group.post('/update-status', User.updateStatus);
    group.post('/change-password', User.changePassword);
});

export default router;
