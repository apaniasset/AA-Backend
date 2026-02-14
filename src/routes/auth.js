import { AuthController as Auth } from '../controllers/AuthController.js';
import { validate } from '../validators/userValidator.js';
import { loginSchema, otpSchema } from '../validators/authValidator.js';

const router = Router();

// Universal Authentication Routes
router.post('/login', validate(loginSchema), Auth.login);
router.post('/logout', Auth.logout);
router.post('/send-otp', Auth.sendOTP);
router.post('/login-otp', validate(otpSchema), Auth.loginWithOTP);

export default router;
