const { StatusCodes } = require('http-status-codes');
const {UserRepository} = require('../repositories');
const AppError = require('../utils/errors/appError');

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

module.exports = {
    createUser
}