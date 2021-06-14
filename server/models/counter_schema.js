const mongoose = require('mongoose')
// const AutoIncrement = require('mongoose-sequence')(mongoose);
const counterSchema = mongoose.Schema(
    {
        // _id: {type: mongoose.Schema.Types.ObjectId, auto: true },
        id: String,
        seq: Number,
    },{ _id: false }
);

// counterSchema.plugin(AutoIncrement, {inc_field: 'counterId'});
// counterSchema.index({id: 1}, {unique: true});
module.exports = mongoose.model('counter', counterSchema)
