const router = require("express").Router();
const {
  login,
  register,
  me,
  updateProfile,
  deleteUser,
  getUserbyId,
  getAllUsers,
  forgetPassword,
  resetCodeCheck,
  resetPassword
} = require("../controllers/auth.controller");
const authValidation = require("../middlewares/validations/auth.validation");
const { tokenCheck } = require("../middlewares/auth");

router.get("/me", tokenCheck, me);

router.get("/get-user/:id", tokenCheck, getUserbyId);

router.get("/get-users", tokenCheck, getAllUsers);

router.post("/login", authValidation.login, login);

router.post("/register", authValidation.register, register);

router.post("/forget-password", authValidation.forgetPassword, forgetPassword);

router.post("/reset-code-check", resetCodeCheck); // validation needed

router.post("/reset-password", resetPassword); // validation needed, past password check

router.patch("/update-profile/:id", tokenCheck, updateProfile); // validation needed

router.delete("/delete-user/:id", tokenCheck, deleteUser);

module.exports = router;