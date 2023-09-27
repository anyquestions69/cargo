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
            let {email, newEmail, password, manager, place} = req.body
            let newData = {}
            if(manager)
                newData.manager=true
            if(newEmail)
                newData.email=newEmail
            if(password)
                newData.password=password
            if(place)
                newData.place=place
            let user = await User.findOneAndUpdate({id:req.params['userId']}, newData, {new: true});
             return res.send(user)
        } catch (error) {
            return res.status(404).send('Ошибка')
        }
       
    }
    async checkRole(req, res){
        if(req.user){
        if(req.user.manager){
            return res.send('manager')
        }else if(req.user.admin){
            return res.send('admin')
        }else{
            return res.send('user')
        }
        }else{
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
                const token = jwt.sign({email:user.email, admin:user.admin, manager:user.manager}, process.env.TOKEN_SECRET, { expiresIn: '3600s' });
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
            let userId = req.params['userId']
            let order = await User.findById({userId})
            if(!order)
                return res.status(404).send('Такого пользователя нет')
            let res = await User.deleteOne({userId})
            return res.send('Успешно удалено')
        } catch (error) {
            return res.status(404).send('Ошибка')
        }
    }

    
    
}
let manager = new Manager()
module.exports = manager