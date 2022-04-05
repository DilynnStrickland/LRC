"use strict";
const joi = require("joi");

const validateOps = {
    abortEarly: false,
    stripUnknown: true,
    errors: {
        escapeHtml: true
    }
};

const registerSchema = joi.object({
    username: joi.string()
        .min(3)
        .token()
        .required(),
    password: joi.string()
        .min(6)
        .required()
});

function validateRegisterBody( req, res, next) {
    const {value, error} = registerSchema.validate(req.body, validateOps);
    if(error) {
        const errorMessages = error.details.map( detail => detail.message);
        return res.status(400).json({"error": errorMessages});
    }
    req.body = value;
    next();
}

module.exports = {
    validateRegisterBody
}