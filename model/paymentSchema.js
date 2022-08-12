const mongoose = require('mongoose')
const Schema = mongoose.Schema;



//Payment Schema
const payment = new Schema({
    clientSecret:{
        type:String
    },
    amount:{
        type: Number,
        required: [true, 'must provide a value'],
        trim: true,
        maxlength: [20, 'cannot be more than 20 characters']
    },
    currency:{
        type: String,
        required: [true, 'must provide a value'],
        trim: true,
        maxlength: [4, 'cannot be more than 20 characters']
    },
    description: {
        type: String
    },
    user:[{
        type:Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }]
})


module.exports = mongoose.model('payments', payment)