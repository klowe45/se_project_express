const router = require("express").Router();
const auth = require("../middleware/auth");
const { getCurrentUser, updateProfile } = require("../controllers/users");

router.get("/users/me", auth, getCurrentUser);
router.patch("users/me", auth, updateProfile);

module.exports = router;
