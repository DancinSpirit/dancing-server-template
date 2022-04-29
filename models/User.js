const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
  },
  {timestamps: true}
)

const Model = mongoose.model("User", schema);

module.exports = Model;