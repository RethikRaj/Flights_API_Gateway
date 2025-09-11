const { StatusCodes } = require('http-status-codes');
const {UserRepository, RoleRepository} = require('../repositories');
const AppError = require('../utils/errors/appError');
const { Auth } = require('../utils/common');
const { Enums } = require('../utils/common');
const { CUSTOMER, ADMIN } = Enums.USER_ROLES;

const userRepository = new UserRepository();
const roleRepository = new RoleRepository();

async function createUser(data){

    // Hash the password -> Done using sequelize hooks(similar to triggers)

    try {
        const user = await userRepository.create(data);

        // Set default role of user to customer
        // Get role by name
        const customerRole = await roleRepository.getByName(CUSTOMER);

        // Magic method provided by sequelize association
        await user.addRole(customerRole);

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
        console.log(user);
        if(!user){
            throw new AppError(['User corresponding to the token do not exist'], StatusCodes.NOT_FOUND);
        }
        const {password, ...userWithoutPassword} = user.dataValues; // removing password from user object before sending it to the user
        return userWithoutPassword;
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

// This function should only be accessed by admin -> Using Middlewares we do this authorization
async function setRoleToUser(data){
    try {
        const user = await userRepository.get(data.id);
        if(!user){
            throw new AppError(['User corresponding to the id do not exist'], StatusCodes.NOT_FOUND);
        }
        const role = await roleRepository.getByName(parseInt(data.role));
        if(!role){
            throw new AppError(['Role corresponding to the name do not exist'], StatusCodes.NOT_FOUND);
        }
        // Magic method provided by sequelize association
        user.addRole(role);

        return user;
    } catch (error) {
        if(error instanceof AppError){
            throw error;
        }
        throw new AppError(['Something went wrong'], StatusCodes.INTERNAL_SERVER_ERROR);   
    }
}

async function isAdmin(id){
    try {
        const user = await userRepository.get(id);
        if(!user){
            throw new AppError(['User corresponding to the id do not exist'], StatusCodes.NOT_FOUND);
        }
        const adminRole = await roleRepository.getByName(ADMIN);
        if(!adminRole){
            throw new AppError(['Role corresponding to the name do not exist'], StatusCodes.NOT_FOUND);
        }
        // Magic method provided by sequelize association
        return user.hasRole(adminRole);
    } catch (error) {
        if(error instanceof AppError){
            throw error;
        }
        throw new AppError(['Something went wrong'], StatusCodes.INTERNAL_SERVER_ERROR);  
    }
}



module.exports = {
    createUser,
    signIn,
    isAuthenticated,
    setRoleToUser,
    isAdmin
}