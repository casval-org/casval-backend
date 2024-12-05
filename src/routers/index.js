const router = require("express").Router();
const auth = require("./auth.routes");
const profile = require("./profile.routes");

router.use(auth);
router.use(profile)

module.exports = router;