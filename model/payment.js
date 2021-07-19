const mongoose = require('mongoose');

let paymentSchema = mongoose.Schema({
    studentid:String,
    studentemail:String,
    donoremail:String,
    status:String,
    studentname:String,
    donorname:String,
    order_id:String,
    pay_id:String

})

module.exports = mongoose.model('payment',paymentSchema)
