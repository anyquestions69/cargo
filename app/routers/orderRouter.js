const express = require("express");
const orderController = require("../controllers/orderController.js");
const mw = require('../middleware/auth.js')
const orderRouter = express.Router();

orderRouter.get("/", orderController.getAll);
orderRouter.get("/:trackId", orderController.getOne);

orderRouter.post('/', orderController.add)
orderRouter.post('/:trackId', orderController.update)
orderRouter.post('/next/:trackId', orderController.nextPoint)
orderRouter.delete('/:trackid', orderController.delete)
 
module.exports = orderRouter;