const express = require("express");

const userController = require("../controllers/user.controller");

const router = express.Router();

router.get("/test", userController.testRoute);

module.exports = router;