const mongoose = require('mongoose')
const Schema = mongoose.Schema
, findOrCreate = require('mongoose-findorcreate')
const UserSchema = new Schema({

googleId: {
 type: String,
 },
 name: {
 type: String,
 },
 familyName: {
   type: String,
   },
 email: {
 type: String,
 match: /[a-z0–9!#$%&’*+/=?^_`{|}~-]+(?:\.[a-z0–9!#$%&’*+/=?^_`{|}~-]+)*@(?:[a-z0–9](?:[a-z0–9-]*[a-z0–9])?\.)+[a-z0–9](?:[a-z0–9-]*[a-z0–9])?/
 },
 displayName :{
    type:String    
 },
 photos:[{
   type:String
 }],
 paymentId:[{
    type:Schema.Types.ObjectId,
        ref: 'payments',
        
 }],
 createdAt:{
    type:Date,
    default:Date.now()
 }
});

module.exports = mongoose.model("User", UserSchema);
