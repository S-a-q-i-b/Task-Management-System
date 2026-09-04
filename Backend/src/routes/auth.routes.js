const express = require("express");

const {
  registerUser,

  loginUser,
  logoutUser,
  getCurrentUser,
} = require("../controllers/auth.controller");


const authMiddleware = require("../middleware/auth.middleware");



const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.get("/me", authMiddleware, getCurrentUser);


module.exports = router;
