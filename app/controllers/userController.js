const {User} = require('../models/user')
const jwt = require('jsonwebtoken')

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: users } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
  
    return { totalItems, users, totalPages, currentPage };
  };

class Manager{

    async getAll(req,res){
        try{
            let users = await User.find({})
            return res.send(users)
        }catch(e){
            console.log(e)
            return res.status(404).send('Ошибка')
        }
    }
   
    async getOne(req,res){
        try{
            let trackId = req.params['email']
            let order = await User.findOne({trackId})
            if(!order)
                return res.status(404).send('Такого заказа нет')
            return res.send(order)
        }catch(e){
            console.log(e)
            return res.status(404).send('Ошибка')
        }
        
    }

    async update(req,res){
        try {
            let {email, newEmail, password} = req.body
            let newData = {}
            let order = await User.findOneAndUpdate({email}, {
               password
            }, {new: true});
             return res.send(order)
        } catch (error) {
            return res.status(404).send('Ошибка')
        }
       
    }

    async setManager(req, res){
        
    }

    async register(req, res){
        try{
            let {email, password} = req.body
                let exists = await User.findOne({email})
                if(exists)
                    return res.status(404).send('Пользователь с таким email уже существует')
                let user = await User.create({
                    email,
                    password,
                    admin:false,
                    manager:false
                })
                const token = jwt.sign({email:user.email, admin:user.admin}, process.env.TOKEN_SECRET, { expiresIn: '3600s' });
                return res.cookie('user',token, { maxAge: 900000, httpOnly: true }).send(user)
        }catch(e){
            console.log(e)
            return res.status(404).send('Ошибка')
        }
    }
    async login(req,res){
        try{
            let {email, password} = req.body
            let user = await User.findOne({email})
            if(!user)
                return res.status(401).send({error:'Такого пользователя не существует'})
            if(user.password==password){
                const token = jwt.sign({email:user.email, admin:user.admin}, process.env.TOKEN_SECRET, { expiresIn: '3600s' });
                return res.cookie('user',token, { maxAge: 900000, httpOnly: true }).send(token)
            }else{
                return res.status(404).send({error:'Неверный пароль'})
            }
        }catch(e){
            return res.status(404).send({error:'Неверный пароль'})
        }
    }

    async logout(req,res){
        return res.clearCookie("user").send('logout');
    }

    async delete(req,res){
        try {
            let trackId = req.params['trackId']
            let order = await Order.findOne({trackId})
            if(!order)
                return res.status(404).send('Такого заказа нет')
            let res = await User.deleteOne({trackId})
            return res.send('Успешно удалено')
        } catch (error) {
            return res.status(404).send('Ошибка')
        }
    }

    
    
}
let manager = new Manager()
module.exports = manager