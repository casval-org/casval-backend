const joi = require("joi");
const APIError = require("../../utils/errors");

class ProfileValidation {
	constructor() { }
	static update = async (req, res, next) => {
		try {
			await joi
				.object({
					birthdate: joi.date(),
          name: joi.any(),
          surname: joi.any(),
          bio: joi.any(),
          sex: joi.any()
				})
				.validateAsync(req.body);
		} catch (err) {
			throw new APIError(err.details[0].message, 422);
		}
		next();
	};
}

module.exports = ProfileValidation;