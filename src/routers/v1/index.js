const express = require('express');
const { PingController } = require('../../controllers');
const userRouter = require('./userRoutes');

const router = express.Router();

router.use('/users', userRouter);

router.get('/ping', PingController.ping);

module.exports = router