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
router.post('/list', User.index);
router.post('/create', validate(userSchema), User.store);
router.post('/show', User.show);
router.post('/update', validate(userSchema), User.update);
router.post('/delete', User.destroy);
router.post('/update-status', User.updateStatus);
router.post('/change-password', User.changePassword);

export default router;
