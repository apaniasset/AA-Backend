import { UserController as Affiliate } from '../controllers/UserController.js';
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
router.post('/list', Affiliate.index);
router.post('/create', validate(userSchema), Affiliate.store);
router.post('/show', Affiliate.show);
router.post('/update', validate(userSchema), Affiliate.update);
router.post('/delete', Affiliate.destroy);

export default router;
