import { Router } from 'express';
import * as userController from '../controllers/userController';
import { validateRegistration, validateLogin } from '../middleware/validation.middleware';

const router = Router();

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateRegistration, userController.register);

/**
 * @route   POST /api/users/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validateLogin, userController.login);

export default router;
