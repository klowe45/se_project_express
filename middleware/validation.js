const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateUrl = (value, helpers) => {
  if (value === null || value === undefined) {
    return "";
  }
  if (value === "") {
    return value;
  }
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};
