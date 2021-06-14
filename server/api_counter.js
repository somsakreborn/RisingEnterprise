const express = require('express');
const path = require('path');
const formidable = require('formidable');
const router = express.Router();
const fs = require('fs');
let uniqid = require('uniqid');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('./config');
const db = require('./db');

const mongoose = require('mongoose');
const Counter = require('./models/counter_schema');
const VerifyToken = require('./auth/VerifyToken');

// search Id Counter by categoryId Seq
router.get(`/counter/categoryId`, function (req, res) {

    console.log("Show Number CategoryId for CTId ");
    // find({'id': 'categoryId'})
    Counter.findOne({'id': 'categoryId'}, (err, result) => {
        if (err) throw err;

        if (result) {
            res.json(result);
        } else {
            res.json([]);
        }
    });
});

// search Id Counter by customerId Seq
router.get(`/counter/customerId`, function (req, res) {

    console.log("Show Number CustomerId for CTId ");
    // find({'id': 'customerId'})
    Counter.findOne({'id': 'customerId'}, (err, result) => {
        if (err) throw err;

        if (result) {
            res.json(result);
        } else {
            res.json([]);
        }
    });
});

// search Id Counter by orderId Seq
router.get(`/counter/orderId`, function (req, res) {

    console.log("Show Number OrderId for ODId ");
    // find({'id': 'orderId'})
    Counter.findOne({'id': 'orderId'}, (err, result) => {
        if (err) throw err;

        if (result) {
            res.json(result);
        } else {
            res.json([]);
        }
    });
});

module.exports = router;
