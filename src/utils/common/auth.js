const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ServerConfig } = require('../../config');

async function checkPassword(plainPassword, encryptedPassword){
    try {
        const isMatch = await bcrypt.compare(plainPassword, encryptedPassword);
        return isMatch;
    } catch (error) {
        throw error;
    }   
}

function generateToken(payload){
    try {
        const token = jwt.sign(payload, ServerConfig.JWT_SECRET_KEY, {expiresIn : ServerConfig.JWT_KEY_EXPIRY});
        return token;
    } catch (error) {
        throw error;
    }
    
}


module.exports = {
    checkPassword,
    generateToken
}