const express = require('express');
const { UserMiddlewares, AuthMiddlewares, AuthorizationMiddlewares } = require('../../middlewares');
const { UserController } = require('../../controllers');
const router = express.Router();

router.post('/signup', UserMiddlewares.validateCreateRequest, UserController.createUser);

router.post('/signin', UserMiddlewares.validateSignInRequest,UserController.signIn);

router.post('/setRole', AuthMiddlewares.checkIsAuthenticated, AuthorizationMiddlewares.checkAdmin, UserController.setRoleToUser);

module.exports = router;