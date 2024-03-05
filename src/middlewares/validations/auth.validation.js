const joi = require("joi");
const APIError = require("../../utils/errors");

class AuthValidation {
  constructor() { }
  static register = async (req, res, next) => {
    try {
      await joi
        .object({
          nickname: joi.string()
            .trim()
            .lowercase()
            .min(3)
            .max(32)
            .required()
            .messages({
              "string.base": `"nickname" must be a type of 'text'`,
              "string.empty": `"nickname" cannot be an empty field`,
              "string.min": `"nickname" should have a minimum length of {#limit}`,
              "string.max": `"nickname" should have a maximum length of {#limit}`,
              "any.required": `"nickname" is a required field`
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