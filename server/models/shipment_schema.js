const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const shipmentSchema = mongoose.Schema(
    {
        _id: {type: mongoose.Schema.Types.ObjectId, auto: true },
        shipmentName: String,
        shipmentComment: String,
        shipmentStatus: {type: Boolean, default: true},
        shipmentStartDate: {type: Date, default: Date.now},
        shipmentCreated: {type: Date, default: Date.now},
        shipmentImage: String
    },{ _id: false }
);

shipmentSchema.plugin(AutoIncrement, {inc_field: 'shipmentId'});
// shipmentSchema.index({shipmentName: 1}, {unique: true});
module.exports = mongoose.model('shipment', shipmentSchema)