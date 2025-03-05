const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateEmail = (value, helpers) => {
  if (validator.isEmail(value)) {
    return value;
  }
  return helpers.error("string.uri");
};
module.exports.validatePutItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().alphanum().length(24).required().messages({
      "string.base": "The itemId must be a string.",
      "string.alphanum": "The itemId must consist of alphanumeric characters.",
      "string.length": "The itemId must be 24 characters long.",
      "any.required": "The itemId is required.",
    }),
  }),
});

module.exports.itemsCreateValidator = celebrate({
  body: Joi.object().keys({
    nmae: Joi.string().required().min(2).max(30).message({
      "string.min": "The minimum length for name is 2",
      "string.max": "The maximum lenght for name is 30",
      "string.empty": "This field is required",
    }),
    weather: Joi.string.vaild("hot", "cold", "warm").required().message({
      "any.required": "The weather field is required",
    }),
    imageUrl: Joi.string.required().custom(validateURL).message({
      "string.empty": "This field is required",
      "string.uri": "A vaild email is needed",
    }),
  }),
});

module.exports.userCreateValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).message({
      "string.min": "The minimum length for name is 2",
      "string.max": "The maximum lenght for name is 30",
      "string.empty": "This field is required",
    }),
    avatar: Joi.string().required().custom(validateURL).message({
      "string.empty": "This field is required",
      "string.uri": "Must be a vaild url",
    }),
    email: Joi.string().required().custom(validateEmail).message({
      "string.empty": "This field is required",
      "string.uri": "Must be a vaild email",
    }),
    password: Joi.string().required().min(8).message({
      "string.empty": "This field is required",
    }),
  }),
});

module.exports.userValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).message({
      "string.min": "The minimum length for name is 2",
      "string.max": "The maximum lenght for name is 30",
      "string.empty": "This field is required",
    }),
    password: Joi.string().required().min(8).message({
      "string.empty": "This field is required",
    }),
  }),
});

module.exports.userCreateValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).message({
      "string.min": "The minimum length for name is 2",
      "string.max": "The maximum lenght for name is 30",
      "string.empty": "This field is required",
    }),
    avatar: Joi.string().required().custom(validateURL).message({
      "string.empty": "This field is required",
      "string.uri": "Must be a vaild url",
    }),
    email: Joi.string().required().custom(validateEmail).message({
      "string.empty": "This field is required",
      "string.uri": "Must be a vaild email",
    }),
    password: Joi.string().required().min(8).message({
      "string.empty": "This field is required",
    }),
  }),
});
