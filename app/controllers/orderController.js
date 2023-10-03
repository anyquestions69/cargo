const {Order, User} = require('../models/user')


const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: users } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
  
    return { totalItems, users, totalPages, currentPage };
  };

class Manager{

    async getAll(req,res){
        try{
            
            let orders = await Order.find({})
            return res.send(orders)
        }catch(e){
            console.log(e)
            return res.status(404).send('Ошибка')
        }
    }

    async getAllForManager(req,res){
        try{
            let user = await User.findOne({email:req.user.email})
            let orders = await Order.find({})
            let ordersArr=[]
            for(let o of orders){
                if(o.status==o.points.length)
                    continue
                if(o.points[parseInt(o.status)].place==user.place)
                    ordersArr.push(o)
            }
            return res.send(ordersArr)
        }catch(e){
            console.log(e)
            return res.status(404).send('Ошибка')
        }
    }
   
    async getOne(req,res){
        try{
            let trackId = req.params['trackId']
            let order = await Order.findOne({trackId})
            if(!order)
                return res.status(404).send('Такого заказа нет')
            return res.send(order)
        }catch(e){
            console.log(e)
            return res.status(404).send('Ошибка')
        }
        
    }
    async getLike(req,res){
        try{
            let trackId = req.params['trackId']
            let order = await Order.find({trackId:{$regex:trackId}})
            if(!order)
                return res.status(404).send('Такого заказа нет')
            return res.send(order)
        }catch(e){
            console.log(e)
            return res.status(404).send('Ошибка')
        }
    }
    async nextPoint(req,res){
        try {
            let trackId = req.params['trackId']
            let exists = await Order.findOne({trackId:trackId})
            if(!exists)
                return res.status(404).send('Такого заказа нет')
            if(exists.status==exists.points.length){
                return res.status(404).send('Заказ уже доставлен')
            }
            exists.points[parseInt(exists.status)].status="Отправлено в следующий пункт"
            exists.points[parseInt(exists.status)].date=Date.now()
            console.log(exists.place)
            console.log(exists.status)

            let order = await Order.findOneAndUpdate({trackId}, {
               status:exists.status+1,
                points:exists.points,
                
            }, {new: true});
            return res.send(order)
        } catch (error) {
            console.log(error)
            return res.status(404).send('Ошибка')
        }
    }
    async checkPrevilege(req,res){
        try {
            let trackId = req.params['trackId']
            let exists = await Order.findOne({trackId:trackId})
            if(!exists)
                return res.status(404).send('Такого заказа нет')
            if(exists.status==exists.points.length){
                return res.send(exists)
            }
            let user = await User.findOne({email:req.user.email})
            if(exists.points[parseInt(exists.status)].address!=user.place){
                return res.status(404).send('Товар не в вашем пункте')
                
            }else{
                return res.status(200).send('Товар в вашем пункте')
            }

        } catch (error) {
            console.log(error)
            return res.status(404).send('Ошибка')
        }
    }
    async setStatus(req, res){
        try{
            let trackId = req.params['trackId']
            let exists = await Order.findOne({trackId:trackId})
            if(!exists)
                return res.status(404).send('Такого заказа нет')
            exists.points[exists.status].status=req.body.status
            exists.points[exists.status].date = Date.now()
            let order = await Order.findOneAndUpdate({trackId}, {
                points:exists.points
            }, {new: true});
            return res.send(order)
        } catch (error) {
            console.log(error)
            return res.status(404).send('Ошибка статус не установлен')
        }
    }
    async update(req,res){
        try {
            let {trackId, sender, receiver, points, status} = req.body
            let order = await Order.findOneAndUpdate({trackId:trackId}, {
                trackId,
                sender: {
                    name: sender.name, 
                    place: sender.place
                },
                receiver:{
                    name:receiver.name,
                    email:receiver.email,
                    place:receiver.place
                },
                points:[points],
                status:status
            }, {new: true});
             return res.send(order)
        } catch (error) {
            return res.status(404).send('Ошибка')
        }
       
    }

   

    async add(req, res){
        try{
            let {trackId, sender, receiver, points} = req.body
            console.log(points)
            if(points.length==0)
                return res.status(404).send('Укажите промежуточные пункты')
            let order = await Order.create({
                trackId,
                sender: {
                    name: sender.name, 
                    place: sender.place
                },
                receiver:{
                    name:receiver.name,
                    email:receiver.email,
                    place:receiver.place
                },
                points:points

            })
            return res.send(order)
        }catch(e){
            console.log(e)
            return res.status(404).send('Ошибка')
        }
    }

    

    async delete(req,res){
        try {
            let trackId = req.params['trackId']
            let order = await Order.findOne({trackId})
            console.log(order)
            if(!order)
                return res.status(404).send('Такого заказа нет')
            let res = await User.deleteOne({trackId:trackId})
            return res.send('Успешно удалено')
        } catch (error) {
            return res.status(404).send('Ошибка')
        }
    }

    
    
}
let manager = new Manager()
module.exports = manager