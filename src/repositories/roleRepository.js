const CrudRepository = require("./crudRepository");

const {Role} = require('../models');

class RoleRepository extends CrudRepository{
    constructor(){
        super(Role);
    }

    async getByName(name){
        const response = await Role.findOne({
            where : {
                name : name
            }
        });
        return response;
    }

}

module.exports = RoleRepository;