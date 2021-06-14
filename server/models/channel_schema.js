const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
const channelSchema = mongoose.Schema(
    {
        _id: {type: mongoose.Schema.Types.ObjectId, auto: true },
        channelImage: {type: String, default: null},
        channelName: String,
        channelUrl : String,
        channelComment: String,
        channelStatus: {type: Boolean, default: true},
        channelLastupdate: {type: Date, default: Date.now},
        channelCreated: {type: Date, default: Date.now},
        // inventoryName: String,
        warehouseId: Number,
    },{ _id: false }
);

channelSchema.plugin(AutoIncrement, {inc_field: 'channelId'});
// channelSchema.index({channelname: 1}, {unique: true});
module.exports = mongoose.model('channel', channelSchema)
