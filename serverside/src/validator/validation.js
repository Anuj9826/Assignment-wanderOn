const mongoose = require('mongoose')
const bcrypt = require("bcrypt");

// validation for empty request body

const isValidRequest = (data) => {
    if (Object.keys(data).length == 0) {
        return false
    }
    return true
}

// validation for check Required field
const checkRequiredFields = (requiredKeys, body) => {
    for (const key of requiredKeys) {
        if (!(key in body) || body[key] == '' || body[key] == undefined || body[key] == null) {
            return key;
        };
    };
    return true;
};

// validation for check valid name
const isValidName = function(name){
    return /^[a-zA-Z ,]+.*$/.test(name)
};

// validation for email
const isValidMail = (email) => {
    return /^[0-9a-zA-Z._%+-]+@gmail\.com$/.test(email);
};

// validation for password
const isValidPassword = (password) => {
    return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(password);
};

// validation for objectid
const isValidId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return false
    }
    return true
}

// validation for hash password 
const hashPassword = async (password) => {
    const hash = await bcrypt.hash(password, 10);
    return hash;
};

module.exports = {
    isValidRequest,
    isValidName,
    isValidMail,
    isValidPassword,
    isValidId,
    hashPassword,
    checkRequiredFields
}