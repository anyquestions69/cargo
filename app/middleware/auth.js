const {User, Order} = require('../models/user')
const config = process.env;
const jwt = require('jsonwebtoken')

class Auth{
    
    async isAuth(req,res,next){
        const token = req.cookies.user
        
        if(token){
        await jwt.verify(token, process.env.TOKEN_SECRET, async(err, user) => {
            let exists = await User.findOne({email:user.email})
           
            if(exists){
                req.user = exists  
                next()
            }else{console.log('Неверный токен');return res.status(404).send('Неверный токен')}
            
        })
        }else{
            console.log('Error');
            return res.status(404).send('Ошибка')
        }
        
    }
    async isManager(req,res,next){
        if(req.user.manager){
            next()
        }else{return res.status(404).send('error')}
        
    
    }
    async isCurrentManager(req,res,next){
        let order = await Order.findOne({trackId:req.params['trackId']})
        if(!order)
            return res.status(404).send('Такого заказа не существует')
        if(!order.points[order.status].place==req.user.address)
            return res.status(404).send('Заказ находится не у вас')
    }
    async isAdmin(req,res,next){
        if(req.user.manager){
            next()
        }else{return res.status(404).send('error')}
        
    
    }
   
}
module.exports = new Auth()