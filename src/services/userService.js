const { StatusCodes } = require('http-status-codes');
const {UserRepository} = require('../repositories');
const AppError = require('../utils/errors/appError');
const { Auth } = require('../utils/common');

const userRepository = new UserRepository();

async function createUser(data){

    // Hash the password -> Done using sequelize hooks(similar to triggers)

    try {
        const user = await userRepository.create(data);
        return user
    } catch (error) {
        if (error.name == 'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError'){
            let explanation = [];
            error.errors.forEach((err)=>{
                explanation.push(err.message);
            })
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        else if (error.name == 'SequelizeDatabaseError'){
            throw new AppError([error.parent.sqlMessage], StatusCodes.BAD_REQUEST);
        }
        throw new AppError(['Cannot create a User'], StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function signIn(data){
    try {
        const {email , password} = data;
        // step 1 : Check if user exists
        const user = await userRepository.getUserByEmail(email);
        if(!user){
            throw new AppError(['User corresponding to the email do not exist'], StatusCodes.NOT_FOUND);
        }

        // Step 2 : Check Passoword matches
        const isPasswordmatch = await Auth.checkPassword(password, user.password);

        if(!isPasswordmatch){
            throw new AppError(['Invalid Password'], StatusCodes.UNAUTHORIZED);
        }

        // Step 3 : Generate Token
        const token = Auth.generateToken({email : user.email, id : user.id});

        return token;
    } catch (error) {
        if(error instanceof AppError){
            throw error;
        }
        throw new AppError(['Something went wrong'], StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAuthenticated(token){
    try {
        const response =  Auth.verifyToken(token); // response will contain the payload with which token was generated and initialized time(iat)
        console.log(response);
        
        // Check if user exists -> Why ? Token may have generated before but user might have been deleted in between
        const user = await userRepository.get(response.id);
        if(!user){
            throw new AppError(['User corresponding to the token do not exist'], StatusCodes.NOT_FOUND);
        }
        return user.id;
    } catch (error) {
        if(error instanceof AppError){
            throw error;
        }
        if(error.name == 'JsonWebTokenError'){
            throw new AppError(['Invalid Token'], StatusCodes.UNAUTHORIZED);
        }
        if(error.name == 'TokenExpiredError'){
            throw new AppError(['Token Expired'], StatusCodes.UNAUTHORIZED);
        }
        throw new AppError(['Something went wrong'], StatusCodes.INTERNAL_SERVER_ERROR);
    }
}



module.exports = {
    createUser,
    signIn,
    isAuthenticated
}