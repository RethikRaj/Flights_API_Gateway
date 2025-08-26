const Joi = require("joi");
const { Regex, ErrorResponse } = require("../utils/common");
const { StatusCodes } = require("http-status-codes");

async function validateCreateRequest(req, res, next){

    const schema = Joi.object({
        email : Joi.string().email().required().messages({
            "string.empty": "Email is required",
            "string.email": "Please provide a valid email address",
            "any.required": "Email is a required field",
        }),
        password : Joi.string().pattern(new RegExp(Regex.passwordRegex)).min(5).max(100).required().messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 5 characters long",
            "string.max": "Password cannot exceed 100 characters",
            "string.pattern.base":
            "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
            "any.required": "Password is required",
        }),
        username : Joi.string().alphanum().min(5).max(30).required().messages({
            "string.empty": "Username is required",
            "string.alphanum": "Username must only contain letters and numbers",
            "string.min": "Username must be at least 5 characters long",
            "string.max": "Username cannot exceed 30 characters",
            "any.required": "Username is a required field",
        })
    });

    // abortEarly: false: returns all validation errors at once instead of stopping at the first
    const {error, value} = schema.validate(req.body, {abortEarly : false});

    if(error){
        console.log(error.details);
        ErrorResponse.error = error.details.map((err) => ({
            field: err.context.key,
            message: err.message,
        }));
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }else{
        next();
    }
}

async function validateSignInRequest(req, res, next){
    const schema = Joi.object({
        email : Joi.string().email().required().messages({
            "string.empty": "Email is required",
            "string.email": "Please provide a valid email address",
            "any.required": "Email is a required field",
        }),
        password : Joi.string().pattern(new RegExp(Regex.passwordRegex)).min(5).max(100).required().messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 5 characters long",
            "string.max": "Password cannot exceed 100 characters",
            "string.pattern.base":
            "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
            "any.required": "Password is required",
        })
    });

    // abortEarly: false: returns all validation errors at once instead of stopping at the first
    const {error} = schema.validate(req.body, {abortEarly : false});

    if(error){
        // console.log(error.details);
        ErrorResponse.error = error.details.map((err) => ({
            field: err.context.key,
            message: err.message,
        }));
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }else{
        next();
    }
}

module.exports = {
    validateCreateRequest,
    validateSignInRequest
}