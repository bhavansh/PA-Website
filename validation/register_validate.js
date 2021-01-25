const validator = require("validator");
const isEmpty = require("is-empty");

//data validation
module.exports = function validateRegisterInput(data) {
    let errors = {};

    data.first_name = !isEmpty(data.first_name) ? data.first_name : "";
    data.last_name = !isEmpty(data.last_name) ? data.last_name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";

    if (validator.isEmpty(data.first_name)) {
        errors.name = "Name field is required";
    }
    if (validator.isEmpty(data.last_name)) {
        errors.name = "Name field is required";
    }
    if (validator.isEmpty(data.email)) {
        errors.name = "Email field is required";
    }
    if (!validator.isEmail(data.email)) {
        errors.name = "Email is invalid";
    }

    if (validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }
    if (!validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "Password must be at least 6 characters";
    }
    return {
        errors,
        isValid: isEmpty(errors),
    };
};
