const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
const warehouseSchema = mongoose.Schema(
    {
        _id: {type: mongoose.Schema.Types.ObjectId, auto: true },
        warehouseName: String,
        warehouseTel: String,
        warehouseAddress: String,
        warehouseComment: String,
        warehouseDefualt: Boolean,
        warehouseStatus: {type: Boolean, default: true},
        warehouseLastupdate: {type: Date, default: Date.now},
        warehouseCreated: {type: Date, default: Date.now}
    },{ _id: false }
);

warehouseSchema.plugin(AutoIncrement, {inc_field: 'warehouseId'});
// warehouseSchema.index({warehouseName: 1}, {unique: true});
module.exports = mongoose.model('warehouse', warehouseSchema)

