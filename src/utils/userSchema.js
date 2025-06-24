const Joi = require("joi");

const userSchema = Joi.object({
  user_email: Joi.string().email().required().label("Email").messages({
    "string.empty": "{{#label}} must be filled",
    "string.email": "{{#label}} must be a valid email",
    "any.required": "{{#label}} is required",
  }),

  user_password: Joi.string()
    .alphanum()
    .min(8)
    .required()
    .label("Password")
    .messages({
      "string.empty": "{{#label}} must be filled",
      "string.alphanum": "{{#label}} must contain only letters and numbers",
      "string.min": "{{#label}} must be at least {#limit} characters",
      "any.required": "{{#label}} is required",
    }),

  user_confirmation_password: Joi.any()
    .equal(Joi.ref("user_password"))
    .required()
    .label("Confirmation Password")
    .messages({
      "any.only": "{{#label}} does not match Password",
      "any.required": "{{#label}} is required",
    }),

  user_nama: Joi.string().required().label("Name").messages({
    "string.empty": "{{#label}} must be filled",
    "any.required": "{{#label}} is required",
  }),
});

module.exports = userSchema;
