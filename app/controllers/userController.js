const {User, Order} = require('../models/user')
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
            let trackId = req.params['userId']
            let order = await User.findById(trackId)
            if(!order)
                return res.status(404).send('Такого пользователя нет')
            return res.send(order)
        }catch(e){
            console.log(e)
            return res.status(404).send('Ошибка')
        }
        
    }

    async addOrder(req,res){
        try{
            let trackId = req.params['trackId']
            let order =  await Order.findOne({trackId:trackId})
            let user = await User.findOne({email:req.user.email})
            user.orders.push(order)
            console.log(user)
            await user.save()
           
            return res.send(order)
        }catch(e){
            console.log(e)
            return res.status(404).send('Ошибка')
        }
        
    }

    async showOrders(req,res){
        try{
          
            let user = await User.findOne({email:req.user.email})
           console.log(user)
           return res.send(user.orders)
           
        }catch(e){
            console.log(e)
            return res.status(404).send('Ошибка')
        }
        
    }
   

    async profile(req,res){
        try{
            
            let order = await User.findOne({email:req.user.email})
            if(!order)
                return res.status(404).send('Такого пользователя нет')
            return res.send(order)
        }catch(e){
            console.log(e)
            return res.status(404).send('Ошибка')
        }
        
    }

    async update(req,res){
        try {
            let {email, password, manager, place} = req.body
            let newData = {}
            if(manager)
                newData.manager=true
            if(password)
                newData.password=password
            if(place)
                newData.place=place
            console.log(newData)
            let user = await User.findOneAndUpdate({_id:req.params['userId']}, newData, {new: true});
            console.log(user)
             return res.send(user)
        } catch (error) {
            return res.status(404).send('Данные не обновлены')
        }
       
    }
    async checkRole(req, res){
        if(req.user){
        if(req.user.admin){
            return res.send('admin')
        }else if(req.user.manager){
            return res.send('manager')
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
                    return res.status(404).send({error:'Пользователь с таким email уже существует'})
                let user = await User.create({
                    email,
                    password,
                    admin:false,
                    manager:false
                })
                const token = jwt.sign({email:user.email, admin:user.admin, manager:user.manager}, process.env.TOKEN_SECRET, { expiresIn: '12800s' });
                return res.cookie('user',token, { maxAge: 900000, httpOnly: true }).send(user)
        }catch(e){
            console.log(e)
            return res.status(404).send({error:'Ошибка'})
        }
    }
    async login(req,res){
        try{
            let {email, password} = req.body
            let user = await User.findOne({email})
            if(!user)
                return res.status(401).send({error:'Такого пользователя не существует'})
            if(user.password==password){
                const token = jwt.sign({email:user.email, admin:user.admin}, process.env.TOKEN_SECRET, { expiresIn: '12800s' });
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
           
            let order = await User.findOne({email:req.user.email})
            if(!order)
                return res.status(404).send('Такого пользователя нет')
            if(req.user.email==order.email || req.user.admin){
                let result = await User.deleteOne({email:req.user.email})
                console.log(res)
                return res.send('Успешно удалено')
            }else{
                return res.status(404).send('Вы не можете удалить этого пользователя')
            }
           
        } catch (error) {
            console.log(error)
            return res.status(404).send(error)
        }
    }

    
    
}
let manager = new Manager()
module.exports = manager