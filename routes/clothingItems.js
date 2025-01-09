const router = require("express").Router();
const { createItem } = require("../models/clothingItem");

router.post("/", createItem);

module.exports = router;
