import {
  validatePutItemId,
  itemsCreateValidator,
} from "../middleware/validation";
const router = require("express").Router();
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
