const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemModel = new Schema({
  role: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  pass: {
    type: String,
    required: true,
  },
  socket_id: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("admins", itemModel);
