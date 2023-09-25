const express = require("express");
const orderController = require("../controllers/orderController.js");
const mw = require('../middleware/auth.js')
const orderRouter = express.Router();

orderRouter.get("/", orderController.getAll);
orderRouter.get("/:userId", orderController.getAll);

orderRouter.post('/', orderController.add)
orderRouter.post('/:userId', orderController.update)
orderRouter.delete('/:userId', orderController.delete)
 
module.exports = orderRouter;