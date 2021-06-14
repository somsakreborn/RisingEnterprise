const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
const userSchema = mongoose.Schema(
    {
            _id: {type: mongoose.Schema.Types.ObjectId, auto: true },
            userName: String,
            userEmail: String,
            userPassword: String,
            userImage: {type: String, default: null},
            userLevel: {type: String, default: "user"},
            userStatus: {type: Boolean, default: true},
            userLastlogin: {type: Date, default: Date.now},
            userCreated: {type: Date, default: Date.now}
    },{ _id: false }
);

userSchema.plugin(AutoIncrement, {inc_field: 'userId'});
// userSchema.index({username: 1}, {unique: true});
module.exports = mongoose.model('user', userSchema)
