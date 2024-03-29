const express = require("express");
const userController = require("../controllers/userController.js");
const mw = require('../middleware/auth.js')
const userRouter = express.Router();

userRouter.get("/", mw.isAuth, mw.isAdminOrManager, userController.getAll);
userRouter.get('/logout', mw.isAuth, userController.logout)
userRouter.get('/profile', mw.isAuth, userController.profile)

userRouter.put('/checkRole', mw.isAuth, userController.checkRole)
userRouter.post('/addOrder/:trackId', mw.isAuth, userController.addOrder)
userRouter.get('/myOrders', mw.isAuth, userController.showOrders)

userRouter.post('/register', userController.register)
userRouter.post('/login', userController.login)
userRouter.get("/:userId", userController.getOne);
userRouter.post('/update/:userId', mw.isAuth,  mw.isAdminOrManager, userController.update)
userRouter.delete('/', mw.isAuth,  userController.delete)

 
module.exports = userRouter;