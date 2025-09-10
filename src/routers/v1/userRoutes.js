const express = require('express');
const { UserMiddlewares, AuthMiddlewares, AuthorizationMiddlewares } = require('../../middlewares');
const { UserController } = require('../../controllers');
const router = express.Router();

/**
 * @swagger
 * /api/v1/users/signup:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Create a new user account with email, username, and password. User is automatically assigned CUSTOMER role.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSignupRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               validation_error:
 *                 summary: Validation Error
 *                 value:
 *                   success: false
 *                   message: "Validation failed"
 *                   data: {}
 *                   error:
 *                     explanation: ["email must be a valid email", "username must be alphanumeric"]
 *                     statusCode: 400
 *               duplicate_email:
 *                 summary: Duplicate Email
 *                 value:
 *                   success: false
 *                   message: "User already exists"
 *                   data: {}
 *                   error:
 *                     explanation: ["email must be unique"]
 *                     statusCode: 400
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/signup', UserMiddlewares.validateCreateRequest, UserController.createUser);

/**
 * @swagger
 * /api/v1/users/signin:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Sign in user
 *     description: Authenticate user with email and password, returns JWT token for subsequent requests.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSigninRequest'
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/AuthToken'
 *             examples:
 *               success:
 *                 summary: Successful Login
 *                 value:
 *                   success: true
 *                   message: "Login successful"
 *                   data:
 *                     token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJpZCI6MSwiaWF0IjoxNjk5NTUwNDAwfQ.example"
 *                   error: {}
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalid_password:
 *                 summary: Invalid Password
 *                 value:
 *                   success: false
 *                   message: "Authentication failed"
 *                   data: {}
 *                   error:
 *                     explanation: ["Invalid Password"]
 *                     statusCode: 401
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               user_not_found:
 *                 summary: User Not Found
 *                 value:
 *                   success: false
 *                   message: "User not found"
 *                   data: {}
 *                   error:
 *                     explanation: ["User corresponding to the email do not exist"]
 *                     statusCode: 404
 */
router.post('/signin', UserMiddlewares.validateSignInRequest,UserController.signIn);

/**
 * @swagger
 * /api/v1/users/setRole:
 *   post:
 *     tags:
 *       - User Management
 *     summary: Assign role to user (Admin only)
 *     description: Assign a role (CUSTOMER or ADMIN) to a user. This endpoint requires admin privileges.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SetRoleRequest'
 *     responses:
 *       200:
 *         description: Role assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - admin privileges required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User or role not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/setRole', AuthMiddlewares.checkIsAuthenticated, AuthorizationMiddlewares.checkAdmin, UserController.setRoleToUser);

module.exports = router;
