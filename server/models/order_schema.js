const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
const orderSchema = mongoose.Schema(
    {
        _id: {type: mongoose.Schema.Types.ObjectId, auto: true },

        // stuff: { type: String, lowercase: true, trim: true }
        // orderId: Number,
        orderODId: String,
        orderChannelId: Number,
        orderStatusCode: {type: Number, min: 0, max: 7, default: 0},
        orderStatusName: {type: String, default: 'process'},
        orderStatus: {type: Boolean, default: false},
        orderCheckedPrint: {type: Boolean, default: false},
        orderSelectedPrint: {type: Boolean, default: false},
        orderLastupdate: {type: Date, default: Date.now},
        orderCreated: {type: Date, default: Date.now},
        customer: {
            _id: {type: mongoose.Schema.Types.ObjectId, auto: false },
            orderCustomerId: Number,
            orderCustomerCMId: String,
            orderCustomerChannelId: Number,
            orderCustomerSocial: String,
            orderCustomerTel: String,
            orderCustomerNameSurname: String,
            orderCustomerIdhome: String,
            orderCustomerAddId: String,
            orderCustomerAddress: String,
            orderCustomerZipcode: String
        },
        products: [{
            _id: {type: mongoose.Schema.Types.ObjectId, auto: false },
            id: Number,
            code: String,
            name: String,
            price: Number,
            amount: Number,
            total: Number,
            image: String
        }],
        delivery:{
            _id: {type: mongoose.Schema.Types.ObjectId, auto: false },
            price: Number,
            orderShipmentId: Number,
            orderTracking: {type: String, default: ''}
        },
        payment:{
            _id: {type: mongoose.Schema.Types.ObjectId, auto: false },
            method: String,
            orderShipmentId: Number,
            orderBankId: Number,
            orderPaymentDate: Date,
            orderPaymentTime: String,
            orderPaymentImage: String
        },
        historys: [{
            _id: {type: mongoose.Schema.Types.ObjectId, auto: false },
            hisName: String,
            hisRemark: String,
            sellerId: Number,
            sellerName: String,
            lastUpdate: {type: Date, default: Date.now}
        }],
        // orderDiscount: Number,
        orderDiscount: {type: Number, default: 0},
        orderTotal: Number,
        orderRemark: {type: String, default: ''},
        orderSellerId: Number,
        orderSellerName: String,
        orderTracking: {type: String, default: ''}

    },{ _id: false }
);

orderSchema.plugin(AutoIncrement, {inc_field: 'orderId'});
orderSchema.index({orderId: 1},{unique: true});
orderSchema.index({orderODId: 1},{unique: true});
// customerSchema.index({cuStomerName: 1}, {unique: true});
module.exports = mongoose.model('order', orderSchema)