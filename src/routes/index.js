const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/registerLogin");
const { getUser, delUser } = require("../controllers/getDelUser");

router.post("/register", register);
router.post("/login", login);

router.get("/users", getUser);
router.delete("/user/:id", delUser);

module.exports = router;
