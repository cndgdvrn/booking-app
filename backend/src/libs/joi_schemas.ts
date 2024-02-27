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
  password: Joi.string().min(6).max(30).pattern(new RegExp("^[a-zA-Z0-9]{6,30}$")).messages({
    "string.empty": "Password field is required",
    "string.min": "Password must have at least 6 characters",
    "string.max": "Password must have at most 30 characters",
    "string.pattern.base": "Password must contain only alphanumeric characters",
  }),
  firstName: Joi.string().min(2).max(30).required().messages({
    "string.empty": "First name field is required",
    "string.min": "First name must have at least 2 characters",
    "string.max": "First name must have at most 30 characters",
    "string.pattern.base": "First name must contain only alphanumeric characters",
  }),
  lastName: Joi.string().min(2).max(30).required().messages({
    "string.empty": "Last name field is required",
    "string.min": "Last name must have at least 2 characters",
    "string.max": "Last name must have at most 30 characters",
    "string.pattern.base": "Last name must contain only alphanumeric characters",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email field is required",
    "string.email": "Invalid email format",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password field is required",
  }),
});

const hotelSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Field of hotel name is required",
  }),
  city: Joi.string().required().messages({
    "string.empty": "City field is required",
  }),
  country: Joi.string().required().messages({
    "string.empty": "Country field is required",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Description field is required",
  }),
  type: Joi.string().required().messages({
    "string.empty": "Type field is required",
  }),
  adultCount: Joi.number().integer().min(0).required().messages({
    "number.empty": "Adult count field is required",
    "number.min": "Adult count must be greater than or equal to 0",
    "number.integer": "Adult count must be an integer",
  }),
  childCount: Joi.number().integer().min(0).required().messages({
    "number.empty": "Child count field is required",
    "number.min": "Child count must be greater than or equal to 0",
    "number.integer": "Child count must be an integer",
  }),
  facilities: Joi.array().items(Joi.string()),
  pricePerNight: Joi.number().min(0).required().messages({
    "number.empty": "Price per night field is required",
    "number.min": "Price per night must be greater than or equal to 0",
  }),
  starRating: Joi.number().integer().min(1).max(5).required().messages({
    "number.empty": "Star rating field is required",
    "number.min": "Star rating must be greater than or equal to 1",
    "number.max": "Star rating must be less than or equal to 5",
    "number.integer": "Star rating must be an integer",
    "number.base": "Star rating must be a number",
  }),
});


const updateHotelSchema = Joi.object({
  imagesToDelete: Joi.string(),
  name: Joi.string().messages({
    "string.empty": "Field of hotel name cannot be empty",
  }),
  city: Joi.string().messages({
    "string.empty": "City field cannot be empty",
  }),
  country: Joi.string().messages({
    "string.empty": "Country field cannot be empty",
  }),
  description: Joi.string().messages({
    "string.empty": "Description field cannot be empty",
  }),
  type: Joi.string().messages({
    "string.empty": "Type field cannot be empty",
  }),
  adultCount: Joi.number().integer().min(0).messages({
    "number.min": "Adult count must be greater than or equal to 0",
    "number.integer": "Adult count must be an integer",
  }),
  childCount: Joi.number().integer().min(0).messages({
    "number.min": "Child count must be greater than or equal to 0",
    "number.integer": "Child count must be an integer",
  }),
  facilities: Joi.array().items(Joi.string()),
  pricePerNight: Joi.number().min(0).messages({
    "number.min": "Price per night must be greater than or equal to 0",
  }),
  starRating: Joi.number().integer().min(1).max(5).messages({
    "number.min": "Star rating must be greater than or equal to 1",
    "number.max": "Star rating must be less than or equal to 5",
    "number.integer": "Star rating must be an integer",
    "number.base": "Star rating must be a number",
  }),
});

export { registerSchema, loginSchema, hotelSchema,updateHotelSchema };