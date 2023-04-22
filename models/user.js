const { Schema, model } = require("mongoose");
const joi = require('joi');
const { handleMongooseError } = require("../utils");

const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, 'Set password for user'],
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: emailRegEx,
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  token: {
    type: String,
    default: "",
  }
}, { versionKey: false, timestamps: true })

userSchema.post("save", handleMongooseError);

const registerSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().pattern(emailRegEx).required(),
    password: joi.string().min(6).required(),
    subscription: joi.string(),
})

const loginSchema = joi.object({
    email: joi.string().pattern(emailRegEx).required(),
    password: joi.string().min(6).required(),
})

const schemas = {
    registerSchema,
    loginSchema
}

const User = model("user", userSchema);

module.exports = {
    schemas, 
    User,
}