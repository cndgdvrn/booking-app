import Joi, { LanguageMessages } from "joi";

const customEmailValidation = Joi.string()
  .email()
  .required()
  .messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
  })
  .custom((value, helpers) => {
    const atIndex = value.indexOf("@");
    if (atIndex < 2) {
        return helpers.error('string.message', { message: "Email must have at least 2 characters before the @ symbol." });
    }
    return value;
  }, "custom.email.validation");

const registerSchema = Joi.object({
  email:customEmailValidation,
  password: Joi.string()
  .min(6)
  .max(30)
  .pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
  .messages({
    "string.empty": "Password field is required",
    "string.min": "Password must have at least 6 characters",
    "string.max": "Password must have at most 30 characters",
    "string.pattern.base": "Password must contain only alphanumeric characters",
  }),
  firstName: Joi.string().min(2).max(30).required(),
  lastName: Joi.string().min(2).max(30).required(),
});



export {registerSchema}