const { StatusCodes } = require("http-status-codes");
const { UserService } = require("../services");
const { ErrorResponse, SuccessResponse } = require("../utils/common");


async function createUser(req, res){
    try {
        const user = await UserService.createUser({
            email : req.body.email,
            password : req.body.password,
            username : req.body.username
        });
        SuccessResponse.data = user;
        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
        // console.log(error);
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse);
    }
}

async function signIn(req,res){
    try {
        const token = await UserService.signIn({
            email : req.body.email,
            password : req.body.password
        });

        SuccessResponse.data = token;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse);
    }
}

async function setRoleToUser(req, res){
    try {
        const user = await UserService.setRoleToUser({
            id : req.body.id,
            role : req.body.role
        });
        SuccessResponse.data = user;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse);
    }
}

module.exports = {
    createUser,
    signIn,
    setRoleToUser
}