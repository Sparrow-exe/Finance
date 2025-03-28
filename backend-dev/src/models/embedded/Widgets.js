// models/embedded/Widgets.js
const { Schema } = require('mongoose');
const commonFields = require('./commonFields');

module.exports = new Schema({
  name: String,
  type: String,
  positionOptions: [{
    x: Number,
    y: Number,
    width: Number,
    height: Number
  }],
  ...commonFields
});
