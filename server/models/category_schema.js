const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
const categorySchema = mongoose.Schema(
    {
        _id: {type: mongoose.Schema.Types.ObjectId, auto: true },
        categoryName: String,
        categoryCTId: String,
        categorySeq: Number,
        categoryComment: String,
        categoryLevel: Number,
        categoryImage: {type: String, default: null},
        categoryStatus: {type: Boolean, default: true},
        categoryLastupdate: {type: Date, default: Date.now},
        categoryCreated: {type: Date, default: Date.now}
    },{ _id: false }
);

categorySchema.plugin(AutoIncrement, {inc_field: 'categoryId'});
// categorySchema.index({categoryName: 1}, {unique: true});
module.exports = mongoose.model('category', categorySchema)
