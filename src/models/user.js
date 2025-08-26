'use strict';
const {
  Model
} = require('sequelize');
const { Regex } = require('../utils/common');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    email: {
      type : DataTypes.STRING,
      allowNull : false,
      unique : true,
      validate : {
        isEmail : true
      }
    },
    password: {
      type : DataTypes.STRING,
      allowNull: false,
      validate : {
        len : [5,100],
        is : Regex.passwordRegex
      }
    },
    username: {
      type : DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate : {
        isAlphanumeric : true,
        len : [5, 30]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};