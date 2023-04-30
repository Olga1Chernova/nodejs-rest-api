const {HttpError, sendEmail} = require('../helpers');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const gravatar = require('gravatar');
const Jimp = require("jimp");
const fs = require('fs/promises');
const path = require('path');

const { nanoid } = require('nanoid');

const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

const { SECRET_KEY, BASE_URL } = process.env;

const { User } = require('../models/user');

const { controllerWrapper } = require('../utils');

const register = async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "This email already exists in database")
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const verificationToken = nanoid();

    const avatarURL = gravatar.url(email);

    const resizedAvatarURL = Jimp.read(avatarURL)
    .then((avatarURL) => {
    return avatarURL
      .resize(250, 250)
    })
    .catch((err) => {
    console.error(err);
    });

    const result = await User.create({...req.body, password: hashPassword, resizedAvatarURL, verificationToken});

    const verify = {
        to: email,
        subject: "Verify your email!",
        html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click here to verify email</a>`
    }

    await sendEmail(verify);

    res.status(201).json({
        name: result.name, 
        email: result.email,
        subscription: result.subscription,
    })
}

const verify = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
        throw HttpError(404, "This email wasn't found");
    }

    await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: ""} )
}

const resend = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(404, "This email wasn't found");
    }
    if (user.verify) {
        throw HttpError(400, "This email is already verified");
    }

     const verify = {
        to: email,
        subject: "Verify your email!",
        html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click here to verify email</a>`
    }

    await sendEmail(verify);

    res.json({
        message: "Email was resend successfully"
    })
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Invalid email or password");
    }

    if (!user.verify) {
        throw HttpError(401, "Email wasn't verified")
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Invalid email or password");
    }

    const payload = {
        id: user._id,
    }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({
        token,
    })
}

const getCurrent = (req, res) => {
    const { name, email } = req.user;
    res.json({
        name,
        email,
    })
}

const logOut = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.json({
        message : "User has done a successful logout"
    })
}

const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const { path: tempUpload, filename } = req.file;
    const avatarName = `${_id}_${filename}`
    const resultUpload = path.join(avatarsDir, avatarName);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("avatars", avatarName)
    await User.findByIdAndUpdate(_id, { avatarURL });
    res.json({ avatarURL });
}

module.exports = {
    register: controllerWrapper(register),
    login: controllerWrapper(login),
    getCurrent: controllerWrapper(getCurrent),
    logOut: controllerWrapper(logOut),
    updateAvatar: controllerWrapper(updateAvatar),
    verify: controllerWrapper(verify),
    resend: controllerWrapper(resend),
}

