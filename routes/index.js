const router = require("express").Router();
const auth = require("../middleware/auth");
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const NotFoundError = require("../customErrors/NotFoundError");
const { createUser, login } = require("../controllers/users");

router.post("/signin", login);
router.post("/signup", createUser);
router.use("/users", auth, userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  throw new NotFoundError("Router not found");
});

module.exports = router;
