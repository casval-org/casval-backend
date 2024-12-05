const router = require("express").Router();
const {
    me,
    update,
    profile,
    updateProfileImage
} = require("../controllers/profile.controller")
const { userTokenCheck } = require("../middlewares/auth");
const { uploadAvatar } = require("../middlewares/uploadAvatar");
const ProfileValidation = require("../middlewares/validations/profile.validation");

router.get("/profile/me", userTokenCheck, me)
router.patch("/profile/me/update", userTokenCheck, ProfileValidation.update, update)
router.post("/profile/me/update/profileImage", userTokenCheck, uploadAvatar, updateProfileImage)
router.get("/profile/:id", userTokenCheck, profile)

module.exports = router;