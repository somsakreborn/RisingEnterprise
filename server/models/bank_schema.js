const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const bankSchema = mongoose.Schema(
    {
        _id: {type: mongoose.Schema.Types.ObjectId, auto: true },
        bankName: String,
        bankBranchname: String,
        bankSerialNumber: String,
        bankComment: String,
        bankStatus: {type: Boolean, default: true},
        bankStartDate: {type: Date, default: Date.now},
        bankCreated: {type: Date, default: Date.now},
        bankImage: String
    },{ _id: false }
);

bankSchema.plugin(AutoIncrement, {inc_field: 'bankId'});
// bankSchema.index({bankName: 1}, {unique: true});
module.exports = mongoose.model('bank', bankSchema)