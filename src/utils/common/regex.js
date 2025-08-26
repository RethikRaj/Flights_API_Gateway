const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,100}$/;
// 5 to 100 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
module.exports = {
    passwordRegex
}