const express = require('express');
const path = require('path');
const formidable = require('formidable');
const router = express.Router();
const fs = require('fs');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('./config');
const db = require('./db');

const mongoose = require('mongoose');
const Employee = require('./models/employee_schema');
const VerifyToken = require('./auth/VerifyToken');

// Add employee
router.post('/employee', function (req, res) {
    console.log("Add Employee V1");
    Employee.create(req.body, (err, result) => {
        if (err) throw err;

        res.json(req.body);
    });
});

function getTableHeader() {

    let tableHeaderArr = '';

    Employee.schema.eachPath(function (path) {

        if (path === 'employeeName') {
            tableHeaderArr += (path + '|ชื่อพนักงาน|1') + ',';
        } else if (path === 'employeeSurname') {
            tableHeaderArr += (path + '|นามสกุลพนักงาน|2') + ',';
        } else if (path === 'employeePosition') {
            tableHeaderArr += (path + '|ตำแหน่งงาน|3') + ',';
        } else if (path === 'employeeEmail') {
            tableHeaderArr += (path + '|อีเมลล์|4') + ',';
        } else if (path === 'employeeBranch') {
            tableHeaderArr += (path + '|สาขา|5') + ',';
        } else if (path === 'employeeAge') {
            tableHeaderArr += (path + '|อายุ|6') + ',';
        } else if (path === 'employeeSalary') {
            tableHeaderArr += (path + '|เงินเดือน|7') + ',';
        } else if (path === 'employeeGender') {
            tableHeaderArr += (path + '|เพศ|8') + ',';
        } else if (path === 'employeeComment') {
            tableHeaderArr += (path + '|รายละเอียด|9') + ',';
        } else if (path === 'employeeStartDate') {
            tableHeaderArr += (path + '|วันที่เริ่ม|10') + ',';
        }  else if (path === 'employeeCreated') {
            tableHeaderArr += (path + '|วันที่สร้าง|11');
        }
    });

    return tableHeaderArr;
}

// Show all employees
router.get(`/employee`, function (req, res) {

    console.log("Show Employee V1 ");

    Employee.find((err, result) => {
        if (err) throw err;
        if (result) {

            res.json({result: result, tableHeader: getTableHeader()});

        } else {
            res.json([]);
        }
    }).sort({ employeeId : 'desc'});
});

// router.get(`/employee`, function (req, res) {
//
//     console.log("Show Employee V1 ");
//
//     Employee.find((err, result) => {
//         if (err) throw err;
//         if (result) {
//             res.json(result);
//
//         } else {
//             res.json([]);
//         }
//     });
// });

// Show Employee by id
// router.get(`/employee/id/:id`, function (req, res) {

router.get(`/employee/:id`, function (req, res) {

    console.log("get for Show Employee with id V1 -- view new --");

    Employee.findOne({employeeId: req.params.id}, (err, result) => {
        if (err) throw err;

        if (result) {
            res.json(result);
        } else {
            res.json([]);
        }
    });
});


// Get Employee by keyword
router.get(`/employee/name/:keyword`, function (req, res) {
    console.log("get employees by keyword");
    // console.log(req.params.keyword);


    const query = {employeeName: new RegExp("^.*" + req.params.keyword + ".*$", "i")};


    Employee.find(query, (err, result) => {
        if (err) throw err;

        if (result) {
            // console.log(err + " true =" + result + query)
            res.json(result);
        } else {
            // console.log(err + "else =" + result + query)
            res.json([]);
        }
        // console.log(err + "555" + result + query)
    });

});

// Update Employee
router.put(`/employee`, function (req, res) {

    console.log("Update Employee V1 ");

    Employee.findOneAndUpdate({employeeId: req.body.employeeId}, req.body, (err, result) => {
        if (err) throw err;
        const response = {result: "ok", message: "Updated"};
        console.log("Update Employee V1: " + req.body._id + ", " + JSON.stringify(result));
        res.json(response);
    });
});

// Delete Employee by id
router.delete(`/employee/:id`, function (req, res) {
    console.log("Delete Employee V1");

    Employee.findOneAndRemove({employeeId: req.params.id}, (err, result) => {
        if (err) throw err;

        const response = {result: "ok", message: "Removed"};
        res.json(response);
    });
});


module.exports = router;
