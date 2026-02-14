import { UserController as Merchant } from '../controllers/UserController.js';
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
router.post('/list', Merchant.index);
router.post('/create', validate(userSchema), Merchant.store);
router.post('/show', Merchant.show);
router.post('/update', validate(userSchema), Merchant.update);
router.post('/delete', Merchant.destroy);

export default router;
