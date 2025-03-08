const router = require("express").Router();
const { userPatchValidator } = require("../middleware/validation");
const auth = require("../middleware/auth");
const { getCurrentUser, updateProfile } = require("../controllers/users");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, userPatchValidator, updateProfile);

module.exports = router;
