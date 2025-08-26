const express = require('express');
const { PingController } = require('../../controllers');
const userRouter = require('./userRoutes');
const { AuthMiddlewares } = require('../../middlewares');

const router = express.Router();

router.use('/users', userRouter);

router.get('/ping', AuthMiddlewares.checkIsAuthenticated ,PingController.ping);

module.exports = router