const joi = require("joi");
const APIError = require("../../utils/errors");

class AuthValidation {
  constructor() { }
  static register = async (req, res, next) => {
    try {
      await joi
        .object({
          username: joi.string()
            .trim()
            .lowercase()
            .min(3)
            .max(32)
            .required()
            .messages({
              "string.base": `"username" must be a type of 'text'`,
              "string.empty": `"username" cannot be an empty field`,
              "string.min": `"username" should have a minimum length of {#limit}`,
              "string.max": `"username" should have a maximum length of {#limit}`,
              "any.required": `"username" is a required field`
            }),
            name: joi.string()
            .trim()
            .min(3)
            .max(32)
            .required()
            .messages({
              "string.base": `"name" must be a type of 'text'`,
              "string.empty": `"name" cannot be an empty field`,
              "string.min": `"name" should have a minimum length of {#limit}`,
              "string.max": `"name" should have a maximum length of {#limit}`,
              "any.required": `"name" is a required field`
            }),
            surname: joi.string()
            .trim()
            .min(3)
            .max(32)
            .required()
            .messages({
              "string.base": `"surname" must be a type of 'text'`,
              "string.empty": `"surname" cannot be an empty field`,
              "string.min": `"surname" should have a minimum length of {#limit}`,
              "string.max": `"surname" should have a maximum length of {#limit}`,
              "any.required": `"surname" is a required field`
            }),
          email: joi
            .string()
            .email()
            .trim()
            .lowercase()
            .min(6)
            .max(100)
            .required()
            .messages({
              "string.base": `"email" must be a type of 'text'`,
              "string.empty": `"email" cannot be an empty field`,
              "string.email": `"email" must be a valid email`,
              "string.min": `"email" should have a minimum length of {#limit}`,
              "string.max": `"email" should have a maximum length of {#limit}`,
              "any.required": `"email" is a required field`,
            }),
          password: joi.string().trim().min(8).max(36).required().messages({
            "string.base": `"password" must be a type of 'text'`,
            "string.empty": `"password" cannot be an empty field`,
            "string.min": `"password" should have a minimum length of {#limit}`,
            "string.max": `"password" should have a maximum length of {#limit}`,
            "any.required": `"password" is a required field`,
          }),
        })
        .validateAsync(req.body);
    } catch (err) {
      throw new APIError(err.details[0].message, 400);
    }
    next();
  };
  static login = async (req, res, next) => {
    try {
      await joi
        .object({
          email: joi
            .string()
            .email()
            .trim()
            .min(6)
            .max(100)
            .required()
            .messages({
              "string.base": `"email" must be a type of 'text'`,
              "string.empty": `"email" cannot be an empty field`,
              "string.email": `"email" must be a valid email`,
              "string.min": `"email" should have a minimum length of {#limit}`,
              "string.max": `"email" should have a maximum length of {#limit}`,
              "any.required": `"email" is a required field`,
            }),
          password: joi.string().trim().min(8).max(36).required().messages({
            "string.base": `"password" must be a type of 'text'`,
            "string.empty": `"password" cannot be an empty field`,
            "string.min": `"password" should have a minimum length of {#limit}`,
            "string.max": `"password" should have a maximum length of {#limit}`,
            "any.required": `"password" is a required field`,
          }),
        })
        .validateAsync(req.body);
    } catch (err) {
      throw new APIError(err.details[0].message, 400);
    }
    next();
  };

  static forgetPassword = async (req, res, next) => {
    try {
      await joi
        .object({
          email: joi
            .string()
            .email()
            .trim()
            .min(6)
            .max(100)
            .required()
            .messages({
              "string.base": `"email" must be a type of 'text'`,
              "string.empty": `"email" cannot be an empty field`,
              "string.email": `"email" must be a valid email`,
              "string.min": `"email" should have a minimum length of {#limit}`,
              "string.max": `"email" should have a maximum length of {#limit}`,
              "any.required": `"email" is a required field`,
            })
        })
        .validateAsync(req.body);
    } catch (err) {
      throw new APIError(err.details[0].message, 400);
    }
    next();
  };

}

module.exports = AuthValidation;