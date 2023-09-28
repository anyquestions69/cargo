const {Order} = require('../models/user')


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
    async nextPoint(req,res){
        try {
            let trackId = req.params['trackId']
            let exists = await Order.findOne({trackId:trackId})
            if(!exists)
                return res.status(404).send('Такого заказа нет')
            console.log(exists.points[parseInt(exists.status)])
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