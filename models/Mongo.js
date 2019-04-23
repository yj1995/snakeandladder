const mongoose = require('mongoose')
let Schema = mongoose.Schema;

const rooms = new Schema({
  roomid: Number,
  player: Number,
  status: String
}, { collection: 'rooms' });

module.exports = Rooms = mongoose.model('rooms', rooms)