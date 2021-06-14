const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
const customerSchema = mongoose.Schema(
    {
            _id: {type: mongoose.Schema.Types.ObjectId, auto: true },
            customerCMId: String,
            customerSocial: String,
            customerNameSurname: String,
            customerIdhome: String,
            customerAddress: String,
            customerTel: String,
            customerZipcode: String,
            customerEmail: String,
            customerIdcard: String,
            customerComment: String,
            customerDefualt: String,
            customerStatus: {type: Boolean, default: true},
            customerLastupdate: {type: Date, default: Date.now},
            customerCreated: {type: Date, default: Date.now},
            customerChannelId: Number
    },{ _id: false }
);

customerSchema.plugin(AutoIncrement, {inc_field: 'customerId'});
// customerSchema.index({customerName: 1}, {unique: true});
module.exports = mongoose.model('customer', customerSchema)