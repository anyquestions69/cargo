const {User} = require('../models/user')
const config = process.env;
const jwt = require('jsonwebtoken')

class Auth{
    
    async isAuth(req,res,next){
        const token = req.cookies.site
        
        if(token){
        await jwt.verify(token, process.env.TOKEN_SECRET, async(err, user) => {
            let exists = await User.findOne({email:user.email})
            console.log(exists)
            if(exists){
                req.user = exists  
                next()
            }else{return res.status(404).send('error')}
            
        })
        }else{
            return res.status(404).send('error')
        }
        
    }
    async isManager(req,res,next){
        if(req.user.manager){
            next()
        }else{return res.status(404).send('error')}
        
    
    }
    async isAdmin(req,res,next){
        if(req.user.manager){
            next()
        }else{return res.status(404).send('error')}
        
    
    }
   
}
module.exports = new Auth()