const mongoose = require('mongoose')
let Schema = mongoose.Schema;

const carSchema = new Schema({
  roomid: Number,
  player: Number,
  status: String
})

module.exports = mongoose.model('Data', carSchema)