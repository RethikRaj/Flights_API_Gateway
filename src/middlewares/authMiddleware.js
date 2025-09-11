const { StatusCodes } = require("http-status-codes");
const { UserService } = require("../services");
const { ErrorResponse } = require("../utils/common");
const AppError = require("../utils/errors/appError");

async function checkIsAuthenticated(req,res, next){
    try {
        const bearerHeader = req.headers['authorization'];
        if(!bearerHeader){
            ErrorResponse.error = new AppError(['Authorization header is required'], StatusCodes.UNAUTHORIZED);
            return res.status(StatusCodes.UNAUTHORIZED).json(ErrorResponse);
        }

        const bearerToken = bearerHeader.split(' ')[1];
        const response = await UserService.isAuthenticated(bearerToken);
        if(response){
            req.user = response; // we get the userId in response if it is a valid user and we set it in the request object so that we can access it in the next middlewares
            next();
        }
    } catch (error) {
        if(error instanceof AppError){
            ErrorResponse.error = error;
            return res.status(error.statusCode).json(ErrorResponse);
        }
        ErrorResponse.error = new AppError(['Something went wrong'], StatusCodes.INTERNAL_SERVER_ERROR);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

module.exports = {
    checkIsAuthenticated
}