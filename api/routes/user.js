const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users");
router.post("/signup", usersController.users_signup);

router.post("/login", usersController.users_login);

router.delete("/:userId", usersController.users_delete_user);

module.exports = router;
