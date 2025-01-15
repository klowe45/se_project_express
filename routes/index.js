const router = require("express").Router();

const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors");
const { createUser, login } = require("../controllers/users");
const auth = require("../middleware/auth");

router.use("/users", userRouter);
router.use("/items", itemRouter);
router.post("/signIn", login);
router.post("/signUp", createUser);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
