const Joi = require("joi");

const spatialUserSchema = Joi.object({
  name: Joi.string().min(3).max(40).required(),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  email: Joi.string().min(3).max(50).email(),
  designation: Joi.string().valid("Aalim", "Hafiz", "Muazzan"),
  mosqueName: Joi.string().min(3).max(100),
  monsqueArea: Joi.string().min(3).max(200),
  password: Joi.string(),
  role: Joi.string().valid("admin", "subadmin"),
  upi: Joi.object({
    id: Joi.string(),
    qr: Joi.string(),
  }),
  profilePic: Joi.string().uri(),
  messages: Joi.array().items(
    Joi.object({
      sender: Joi.string(),
      content: Joi.string(),
      timestamp: Joi.date().timestamp(),
    })
  ),
});

// Export the schema
module.exports = {
  spatialUserSchema,
};
