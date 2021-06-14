const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);

const employeeSchema = mongoose.Schema(
    {
            _id: {type: mongoose.Schema.Types.ObjectId, auto: true },
            employeeName: String,
            employeeSurname: String,
            employeeEmail: String,
            employeeAge: Number,
            employeeGender: String,
            employeeBranch: String,
            employeeSalary: Number,
            employeeComment: String,
            employeeStartDate: {type: Date, default: Date.now},
            employeePosition: {type: String, default: "พนักงาน"},
            employeeCreated: {type: Date, default: Date.now}
    },{ _id: false }
);

employeeSchema.plugin(AutoIncrement, {inc_field: 'employeeId'});
// employeeSchema.index({employeename: 1}, {unique: true});
module.exports = mongoose.model('employee', employeeSchema)
