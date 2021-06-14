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
const Product = require('./models/product_schema');
const VerifyToken = require('./auth/VerifyToken');

// Add product
router.post(`/product`, function (req, res) {
    console.log("Add Product V1");
    Product.create(req.body, (err, result) => {
        if (err) throw err;

        res.json(req.body);
    });
});


// Show all products
router.get(`/product`, function (req, res) {

    console.log("Show Product V1 ");
    Product.find((err, result) => {
        if (err) throw err;

        if (result) {
            res.json(result);
        } else {
            res.json([]);
        }
    }).sort({ productId : 'desc'});
});

// Show Product by id
// router.get(`/product/id/:id`, function (req, res) {
router.get(`/product/:id`, function (req, res) {

    // console.log("get for Show Product with id V1 -- view new --");
    Product.findOne({productId: req.params.id}, (err, result) => {
        if (err) throw err;

        if (result) {
            res.json(result);
        } else {
            res.json([]);
        }
    });
});


// Show ProductWarehouse by id

router.get(`/productwarehouse/:id`, function (req, res) {

    // console.log("get for Show Product with id V1 -- view new --");
    Product.findOne({warehouseId: req.params.id}, (err, result) => {
        if (err) throw err;

        if (result) {
            res.json(result);
            //return true;
        } else {
            res.json([]);
            //return false;
        }
    });
});

// Get Product by keyword
router.get(`/product/name/:keyword`, function (req, res) {
    console.log("get products by keyword");
    // console.log(req.params.keyword);

    // find( { $or: [{ productName: {'$regex':'45'}}, { productCodename: {'$regex':'45'} } ] } )
    // find  { $or: [{ productName: {'$regex':'45'}}, {productCodename:{'$regex':'45'}} ]}
    // const query = {productName: new RegExp("^.*" + req.params.keyword + ".*$", "i")};
    // let regx = new RegExp(query, 'i');
    const regx = new RegExp("^.*" + req.params.keyword + ".*$", "i");

    // const query = { $or: [ {
    //     productName: new RegExp("^.*" + req.params.keyword + ".*$", "i"),
    //     productCodename: new RegExp("^.*" + req.params.keyword + ".*$", "i")
    //     } ]
    // };
    // const query1 = {productCodename: new RegExp("^.*" + req.params.keyword + ".*$", "i")};
    // const q = { "$or": [ { query } ,{ query1 } ] };

    Product.find({ $or: [
            { productName: regx },
            { productCodename: regx } ] },
            (err, result) => {
    // Product.find(query, (err, result) => {
        if (err) throw err;

        if (result) {
            // console.log(err + " true =" + result + query)
            res.json(result);
        } else {
            // console.log(err + "else =" + result + query)
            res.json([]);
        }
    });
});

// Get Product by keyword to codename only for orderProductScanner //
router.get(`/product/codename/:keyword`, function (req, res) {
    console.log("get products by keyword");
    // console.log(req.params.keyword);

    // find( { $or: [{ productName: {'$regex':'45'}}, { productCodename: {'$regex':'45'} } ] } )
    // find  { $or: [{ productName: {'$regex':'45'}}, {productCodename:{'$regex':'45'}} ]}
    // const query = {productName: new RegExp("^.*" + req.params.keyword + ".*$", "i")};
    // let regx = new RegExp(query, 'i');

    // old skip for OR filter any name //
    // const regx = new RegExp("^.*" + req.params.keyword + ".*$", "i");
    // const regx = new RegExp(req.params.keyword, "i");

    // const query = { $or: [ {
    //     productName: new RegExp("^.*" + req.params.keyword + ".*$", "i"),
    //     productCodename: new RegExp("^.*" + req.params.keyword + ".*$", "i")
    //     } ]
    // };
    // const query1 = {productCodename: new RegExp("^.*" + req.params.keyword + ".*$", "i")};
    // const q = { "$or": [ { query } ,{ query1 } ] };

    // Product.find({ $or: [
    //             // { productName: regx },
    //             { productCodename: regx } ] },
    //     (err, result) => {
        Product.findOne({productCodename: req.params.keyword}, (err, result) => {
            // Product.find(query, (err, result) => {
            if (err) throw err;

            if (result) {
                // console.log(err + " true =" + result + query)
                res.json(result);
            } else {
                // console.log(err + "else =" + result + query)
                res.json([]);
            }
        });
});

// Update Product
router.put(`/product`, function (req, res) {
    console.log("Update Product V1 ");

    Product.findOneAndUpdate({productId: req.body.productId}, req.body, (err, result) => {
        // console.log('result : ' + result.productImage);
        if ((result.productImage === '') || (result.productImage === null)) {
            // console.log('image is Null && ""');
        } else if (result.productImage === req.body.productImage) {
            // console.log('Same image');
        } else if ((result.productImage === '') &&  (req.body.productImage.length > 0)) {
            // console.log('Not same image');
        } else if ((result.productImage === null) &&  (req.body.productImage.length > 0)) {
            // console.log('file image cannot deleted but update new picture successfully');
            // console.log('<><> >> ' + req.body.productImage + " <++> " + result.productImage);
            // ถ้ามีไฟล์รูปภาพใหม่มาแทนที่ ให้ไฟล์ภาพเก่าทิ้งก่อน
            fs.unlink(`server/uploaded/images/product/` + result.productImage, function(err){
                if(err) return console.log(err);
                console.log('1-- file deleted successfully => ' + result.productImage);
            });
        } else if ((result.productImage.length > 0) &&  (req.body.productImage.length > 0)) {
            // console.log('file image cannot deleted but update new picture successfully');
            // console.log('<><> >> ' + req.body.productImage + " <++> " + result.productImage);
            // ถ้ามีไฟล์รูปภาพใหม่มาแทนที่ ให้ไฟล์ภาพเก่าทิ้งก่อน
            fs.unlink(`server/uploaded/images/product/` + result.productImage, function(err){
                if(err) return console.log(err);
                console.log('2--file deleted successfully => ' + result.productImage);
            });
        }

        if (err) throw err;

        const response = {result: "ok", message: "Updated"};
        console.log("Update Product V1: " + req.body._id + ", " + JSON.stringify(result));
        res.json(response);
    });
});

// Delete Product by id
router.delete(`/product/:id`, function (req, res) {
    console.log("Delete Product V1");

    Product.findOneAndRemove({productId: req.params.id}, (err, result) => {
        // ถ้ามีไฟล์รูปภาพ  ให้ไฟล์ภาพเก่าทิ้งก่อน แล้วลบข้อมูลในดาต้าเบส
        // if ((result.productImage !== '') || (result.productImage !== null)) {
        if ((result.productImage == '') || (result.productImage == null)) {
            // console.log(result.productImage);
        } else {
            fs.unlink(`server/uploaded/images/product/` + result.productImage, function(err){
                if(err) return console.log(err);
                console.log('file deleted successfully => ' + result.productImage);
            });
        }

        if (err) throw err;

        const response = {result: "ok", message: "Removed"};
        res.json(response);
    });
});

// Upload file
router.post(`/fileUploadProduct`, function (req, res) {

    console.log("Upload File Product");

    try {
        const form = new formidable.IncomingForm();
        const newname = uniqid.time() + uniqid();
        form.parse(req, function (err, fields, files) {

            const oldpath = files['file'].path;
            const fileExtention = files['file'].name.split(".")[1];
            const newpath = path.resolve(`server/uploaded/images/product`) + '/' + newname + "." + fileExtention;
            console.log(newpath);
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                res.end('[{"success":1,"messege":"File uploaded and moved!","name":"' + newname + "." + fileExtention + '"}]');
            });
        });
    } catch (err) {
        console.log("err : " + err);
    }
});

// Show Product by id for update hold to stock //
router.get(`/product/:id/hold/:hold`, function (req, res) {

    console.log('Id : ' +req.params.id);
    console.log('Hold : ' +req.params.hold);

// console.log("get for Show Product with id V1 -- view new --");
    Product.findOne({productId: req.params.id}, (err, result) => {

        console.log('5555 ' +err);
        console.log('Id : ' +req.params.id);

        if (err) throw err;

        if (result) {
            res.json(result);
            console.log(result);
        } else {
            res.json([]);
        }
    });
});

// Update Product hold //
router.put(`/product/:id/hold/:hold`, function (req, res) {
    console.log("Update Product Hold V1 ");
    console.log("id : "+ req.params.id);
    console.log("hold : "+ req.params.hold);
    // productHold += req.params.hold
    // Product.findOne({productId: req.body.productId}, req.params.hold, (err, result) => {
    Product.findOneAndUpdate({productId: req.params.id}, {
        $set:{
            productHold: req.params.hold
        }
    }, (err, result) => {
    // if(req.params.hold < result.productHold) { productHold += req.params.hold }
        console.log('resultProductHold : ' + result.productHold);
        console.log('resultparamsHold : ' + req.params.hold);
        // console.log('resultBodyHold : ' + req.body.hold);

        if (err) throw err;

        const response = {result: "ok", message: "Updated hold"};
        // console.log("Update Product hold V1: " + req.body._id + ", " + JSON.stringify(result));
        res.json(response);
    });
});

// Product.hold = (id, data, cb) => {
//     db.product.findOne({ _id: ObjectId(id) }, (err, product) => {
//         if (err) { return cb(err); }
//         if (!product) { return cb(err, 0); }
//
//         const hasSize = !!data.size;
//
//         if (hasSize) {
//             data.size.forEach(holdSize => {
//                 const size = product.size.find(s => s.code === holdSize.code);
//                 if (size) {
//                     size.hold += holdSize.hold;
//                     size.remain -= holdSize.hold;
//                 }
//             });
//         }
//
//         product.hold += data.hold;
//         product.remain -= data.hold;
//
//         db.product.save(product, (err, saved) => {
//             cb(err, product.hold);
//         });
//     });
// };

//
// Product.updateStock = (id, data, cb) => {
//     db.product.findOne({ _id: ObjectId(id) }, (err, product) => {
//         if (err) { return cb(err); }
//         if (!product) { return cb(err, 'not found'); }
//
//         const hasSize = !!data.size;
//
//         if (hasSize) {
//             data.size.forEach(stockSize => {
//                 const size = product.size.find(s => s.code === stockSize.code);
//                 if (size) {
//                     size.inStock -= stockSize.amount;
//                     size.hold -= stockSize.amount;
//                 } else {
//                     data.amount -= stockSize.amount;
//                 }
//             });
//         }
//
//         product.inStock -= data.amount;
//         product.hold -= data.amount;
//         db.product.save(product, (err, saved) => {
//             cb(err, saved);
//         });
//     });
// };

module.exports = router;
