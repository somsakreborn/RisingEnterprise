const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
const productSchema = mongoose.Schema(
    {
        _id: {type: mongoose.Schema.Types.ObjectId, auto: true },
        productName: String,
        productPDId: String,
        productCodename: String,
        productBarcode: String,
        productSeq: Number,
        productComment: String,
        productDetail: String,
        productTag: String,
        productImage: {type: String, default: null},
        productStatus: {type: Boolean, default: true},
        productLastupdate: {type: Date, default: Date.now},
        productCreated: {type: Date, default: Date.now},

        categoryId: Number,
        // warehouseId: Number,
        warehouseId: {type: Number, default: 1},

        productCategory: String,
        productInventory: Number,
        productCost: Number,
        productPiece: Number,
        productTotal: Number,
        productHold: {type: Number, default: 0},
        productRemain: {type: Number, default: 0},
        productMinimum: Number,
        productWeight: Number,
        historys: [{
                _id: {type: mongoose.Schema.Types.ObjectId, auto: false },
                hisName: String,
                hisRemark: String,
                sellerId: Number,
                sellerName: String,
                lastUpdate: {type: Date, default: Date.now}
        }]

    },{ _id: false }
);

productSchema.plugin(AutoIncrement, {inc_field: 'productId'});
productSchema.index({productId: 1},{unique: true});
productSchema.index({productCodename: 1},{unique: true});
// productSchema.index({productName: 1}, {unique: true});
module.exports = mongoose.model('product', productSchema)
