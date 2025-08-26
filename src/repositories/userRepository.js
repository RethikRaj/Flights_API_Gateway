const CrudRepository = require('./crudRepository');
const {User} = require('../models')
class UserRepository extends CrudRepository{
    constructor(){
        super(User);
    }

    async getUserByEmail(email){
        return await User.findOne({where : {email : email}});
    }
}

module.exports = UserRepository;