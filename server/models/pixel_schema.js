const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
const pixelSchema = mongoose.Schema(
    {
        _id: {type: mongoose.Schema.Types.ObjectId, auto: true },
        // pixelImage: {type: String, default: null},
        pixelName: String,
        pixelView: String,
        pixelFBId: String,
        channelId: Number,
        pixelCustom: String,
        pixelCustomId : Number,
        pixelCustomEvent : String,
        pixelComment: String,
        pixelStatus: {type: Boolean, default: true},
        pixelLastupdate: {type: Date, default: Date.now},
        pixelCreated: {type: Date, default: Date.now},
    },{ _id: false }
);

pixelSchema.plugin(AutoIncrement, {inc_field: 'pixelId'});
// pixelSchema.index({pixelname: 1}, {unique: true});
module.exports = mongoose.model('pixel', pixelSchema)
