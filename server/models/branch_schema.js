const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const branchSchema = mongoose.Schema(
  {
    _id: {type: mongoose.Schema.Types.ObjectId, auto: true },
    branchName: String,
    branchImage: String,
    branchComment: String,
    branchStartDate: {type: Date, default: Date.now},
    branchCreated: {type: Date, default: Date.now}
  },{ _id: false }
);

branchSchema.plugin(AutoIncrement, {inc_field: 'branchId'});
// branchSchema.index({branchName: 1}, {unique: true});
module.exports = mongoose.model('branch', branchSchema)
