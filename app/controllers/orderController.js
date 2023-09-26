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
            let exists = await Order.findOne({trackId})
            if(!exists)
                return res.status(404).send('Такого заказа нет')
            let order = await Order.findOneAndUpdate({trackId}, {
               status:exists.status+1
            }, {new: true});
        } catch (error) {
            console.log(error)
            return res.status(404).send('Ошибка')
        }
    }
    async update(req,res){
        try {
            let {trackId, sender, receiver, points, status} = req.body
            let order = await Order.findOneAndUpdate({trackId}, {
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
                points:[points]
            }, {new: true});
             return res.send(order)
        } catch (error) {
            return res.status(404).send('Ошибка')
        }
       
    }

   

    async add(req, res){
        try{
            let {trackId, sender, receiver, points} = req.body
               
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