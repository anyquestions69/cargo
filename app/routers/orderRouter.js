const express = require("express");
const orderController = require("../controllers/orderController.js");
const mw = require('../middleware/auth.js')
const orderRouter = express.Router();

orderRouter.get("/", mw.isAuth, orderController.getAll);
orderRouter.get("/:trackId", orderController.getOne);

orderRouter.post('/', mw.isAuth, mw.isAdmin, orderController.add)
orderRouter.post('/:trackId', mw.isAuth, orderController.update)
orderRouter.post('/status/:trackId', mw.isAuth, orderController.setStatus)
orderRouter.post('/next/:trackId', mw.isAuth, orderController.nextPoint)
orderRouter.delete('/:trackId',mw.isAuth,  orderController.delete)
 
module.exports = orderRouter;