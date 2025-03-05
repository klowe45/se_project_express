import { userValidator } from "../middleware/validation";
const router = require("express").Router();
const auth = require("../middleware/auth");
const { getCurrentUser, updateProfile } = require("../controllers/users");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, userValidator, updateProfile);

module.exports = router;
