const express = require("express");
const userController = require("../controllers/userController.js");
const mw = require('../middleware/auth.js')
const userRouter = express.Router();
const adminRouter = express.Router()

userRouter.use('/admin', adminRouter)
userRouter.get("/", userController.getAll);
userRouter.get("/:userId", userController.getAll);

userRouter.post('/register', userController.register)
userRouter.post('/login', userController.login)
userRouter.post('/logout', userController.logout)
userRouter.post('/update', userController.update)
userRouter.delete('/:userId', userController.delete)
 
module.exports = userRouter;