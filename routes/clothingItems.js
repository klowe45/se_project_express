const router = require("express").Router();
const {
  validatePutItemId,
  itemsCreateValidator,
} = require("../middleware/validation");
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");
const auth = require("../middleware/auth");

router.post("/", auth, itemsCreateValidator, createItem);
router.get("/", getItems);
router.delete("/:itemId", auth, validatePutItemId, deleteItem);
router.put("/:itemId/likes", auth, validatePutItemId, likeItem);
router.delete("/:itemId/likes", auth, validatePutItemId, dislikeItem);

module.exports = router;
