const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  trackId:{
    type:String,
    required: true,
    unique:true
  },
  sender:{
    name:{
      type:String
    },
    place:{
      type:String
    }
  },
  receiver:{
    name:{
      type:String
    },
    email:{
      type:String
    },
    place:{
      type:String
    }
  },
  points:[
    { 
      place:String,
      status:String,
      manager: {type: mongoose.Schema.Types.ObjectId, ref: 'Manager'},
      date: Date
    }
  ],
  status:{
    type: Number,
    default:0
  }
  
}, { timestamps: true });


const userSchema = new Schema({
  
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true,
  },
  place:{
    type:String
  },
  admin:{
    type:Boolean,
    default:false
  },
  manager:{
    type:Boolean,
    default:false
  },
  orders:[{ type: Schema.Types.ObjectId, ref: 'User' }]
})



const Order = mongoose.model('Order', orderSchema)
const User = mongoose.model('User', userSchema)
User.findOne({email:process.env["ADMIN_EMAIL"]}).then(async (exists)=>{
  if(!exists)
    await User.create({email:process.env["ADMIN_EMAIL"], password: process.env["ADMIN_PASSWORD"] , admin:true})
})

module.exports = {Order, User}