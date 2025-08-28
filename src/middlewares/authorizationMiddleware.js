const { StatusCodes } = require('http-status-codes');
const {UserService} = require('../services');
const AppError = require('../utils/errors/appError');
const { ErrorResponse } = require('../utils/common');

async function checkAdmin(req, res, next){
    try {
        const isAdmin = await UserService.isAdmin(req.user); // In auth middleware(checkAuth), if the user is authenticated, we set req.user to be the userId of the authenticated user. We can use this userId to check if the user is admin or not
        if(!isAdmin){
            ErrorResponse.error = new AppError(['User not authorized for this action'], StatusCodes.FORBIDDEN);
            return res.status(StatusCodes.FORBIDDEN).json(ErrorResponse);
        }
        next();
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse);
    }
}

module.exports = {
    checkAdmin
}