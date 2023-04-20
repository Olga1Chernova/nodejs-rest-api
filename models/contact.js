const { Schema, model } = require("mongoose");
const joi = require('joi');
const {handleMongooseError} = require("../utils")

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, "name field shouldn't be empty"],
    },
    email: {
        type: String,
        required: [true, "email field shouldn't be empty"],
    },
    phone: {
        type: String,
        required: [true, "phone field shouldn't be empty"],
    },
    blocked: {
        type: Boolean,
        default: false,
    }
}, {
    versionKey: false,
    timestamps: true,
});

const Contact = model("contact", contactSchema);

contactSchema.post("save", handleMongooseError);

const addSchema = joi.object({
  name: joi.string().required().messages({
    "any.required": `"name" is required`,
    "string.empty":`"name" field can't be empty!`
  }),
  phone: joi.string().required().messages({
    "any.required": `"phone" is required`,
    "string.empty":`"phone" field can't be empty!`
  }),
  email: joi.string().required().messages({
    "any.required": `"email" is required`,
    "string.empty":`"email" field can't be empty!`
  }),
  blocked: joi.boolean()
})

const updateBlocked = joi.object({
  blocked: joi.boolean().required(),
})

const schemas = {
  addSchema,
  updateBlocked
}

module.exports = {
    Contact,
    schemas
}

