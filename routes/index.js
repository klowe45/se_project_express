const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  userCreateValidator,
  userValidator,
} = require("../middleware/validation");
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const NotFoundError = require("../customErrors/NotFoundError");
const { createUser, login } = require("../controllers/users");

router.post("/signin", userValidator, login);
router.post("/signup", userCreateValidator, createUser);
router.use("/users", auth, userRouter);
router.use("/items", itemRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Router not found"));
});

module.exports = router;
