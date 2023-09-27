const express = require("express");
const userController = require("../controllers/userController.js");
const mw = require('../middleware/auth.js')
const userRouter = express.Router();

userRouter.get("/", userController.getAll);
userRouter.get("/:userId", userController.getOne);

userRouter.put('/checkRole', mw.isAuth, userController.checkRole)

userRouter.post('/register', userController.register)
userRouter.post('/login', userController.login)
userRouter.get('/logout', mw.isAuth, userController.logout)
userRouter.post('/update/:userId', mw.isAuth, userController.update)
userRouter.delete('/:userId', userController.delete)

 
module.exports = userRouter;