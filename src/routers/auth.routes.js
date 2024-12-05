const router = require("express").Router();
const {
  login,
  register,  
  forgetPassword,
  resetCodeCheck,
  resetPassword
} = require("../controllers/auth.controller");

const validation = require("../middlewares/validations/auth.validation");

router.post("/auth/login", validation.login, login);
router.post("/auth/signup", validation.register, register);
router.post("/auth/forget-password", validation.forgetPassword, forgetPassword);
router.post("/auth/reset-code-check", resetCodeCheck);
router.post("/auth/reset-password", resetPassword);

module.exports = router;