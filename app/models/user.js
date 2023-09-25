const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  trackId:{
    type:Number,
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
    type: Number
  }
  
}, {versionKey: false}, {timeStamps:true});

const userSchema = new Schema({
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true,
  }
})

const adminSchema = new Schema({
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true,
  }
})
const managerSchema = new Schema({
  
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
    type:String,
    required:true
  }
})



const Order = mongoose.model('Order', orderSchema)
const User = mongoose.model('User', userSchema)
const Admin = mongoose.model('Admin', adminSchema)
const Manager = mongoose.model('Manager', managerSchema)
module.exports = {Order, User, Admin, Manager, Status}