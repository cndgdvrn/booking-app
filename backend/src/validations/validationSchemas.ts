import Joi, { LanguageMessages } from "joi";

const messages: LanguageMessages = {
  "string.email": "Invalid email format",
  "string.empty": "Email is required",
  "string.custom": "Email must have at least 2 characters before the @ symbol.",
};

const customEmailValidation = Joi.string()
  .email()
  .required()
  .messages(messages)
  .custom((value, helpers) => {
    const atIndex = value.indexOf("@");
    if (atIndex < 2) {
      return helpers.error("string.custom");
    }
    return value;
  }, "custom email validation");

const registerSchema = Joi.object({
  email: customEmailValidation,
  password: Joi.string()
    .min(6)
    .max(30)
    .pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
    .messages({
      "string.empty": "Password field is required",
      "string.min": "Password must have at least 6 characters",
      "string.max": "Password must have at most 30 characters",
      "string.pattern.base":
        "Password must contain only alphanumeric characters",
    }),
  firstName: Joi.string().min(2).max(30).required().messages({
    "string.empty": "First name field is required",
    "string.min": "First name must have at least 2 characters",
    "string.max": "First name must have at most 30 characters",
    "string.pattern.base":
      "First name must contain only alphanumeric characters",
  }),
  lastName: Joi.string().min(2).max(30).required().messages({
    "string.empty": "Last name field is required",
    "string.min": "Last name must have at least 2 characters",
    "string.max": "Last name must have at most 30 characters",
    "string.pattern.base":
      "Last name must contain only alphanumeric characters",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email field is required",
    "string.email": "Invalid email format",
  }),
  password: Joi.string().min(6).max(30).required().messages({
    "string.empy": "Password field is required",
  }),
});

export { registerSchema, loginSchema };
