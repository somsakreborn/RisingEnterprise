const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
const inventorySchema = mongoose.Schema(
    {
        _id: {type: mongoose.Schema.Types.ObjectId, auto: true },
        //inventoryINId: String,
        // inventoryImage: {type: String, default: null},
        inventoryName: String,
        inventoryBalance: String,
        inventoryReverse: String,
        // inventoryStatus: {type: Boolean, default: true},
        inventoryLastupdate: {type: Date, default: Date.now},
        inventoryCreated: {type: Date, default: Date.now},
    },{ _id: false }
);

inventorySchema.plugin(AutoIncrement, {inc_field: 'inventoryId'});
// inventorySchema.index({inventoryName: 1}, {unique: true});
module.exports = mongoose.model('inventory', inventorySchema)
