const express = require("express");

const controller = require('../../controllers/auth-controllers');

const { validateBody } = require('../../utils');

const { schemas } = require("../../models/user");

const {authenticate, upload} = require('../../middlewares');

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), controller.register);

router.post("/login", validateBody(schemas.loginSchema), controller.login);

router.get("/current", authenticate, controller.getCurrent);

router.post("/logout", authenticate, controller.logOut);

router.patch("/avatars", authenticate, upload.single("avatar"), controller.updateAvatar)

module.exports = router;

