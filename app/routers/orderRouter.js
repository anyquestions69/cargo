const express = require("express");
const orderController = require("../controllers/orderController.js");
const mw = require('../middleware/auth.js')
const orderRouter = express.Router();

orderRouter.get("/", mw.isAuth, mw.isAdminOrManager, orderController.getAll);

orderRouter.get("/manager", mw.isAuth, mw.isAdminOrManager, orderController.getAllForManager);
orderRouter.get("/:trackId", orderController.getOne);
orderRouter.get("/check/:trackId", mw.isAuth, mw.isAdminOrManager, orderController.checkPrevilege);

orderRouter.post('/', mw.isAuth, mw.isAdmin, orderController.add)
orderRouter.post('/:trackId', mw.isAuth, mw.isAdminOrManager, orderController.update)
orderRouter.post('/status/:trackId', mw.isAuth,mw.isAdminOrManager, orderController.setStatus)
orderRouter.post('/next/:trackId', mw.isAuth, mw.isAdminOrManager, orderController.nextPoint)
orderRouter.delete('/:trackId',mw.isAuth, mw.isAdmin, orderController.delete)
 
module.exports = orderRouter;