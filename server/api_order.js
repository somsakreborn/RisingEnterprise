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
const Order = require('./models/order_schema');
const Counter = require('./models/counter_schema');
const VerifyToken = require('./auth/VerifyToken');

// add function genOrderODId //
const moment = require('moment');
function genCode(orderId) {
    // const day = moment().format('YYYYMMDD');
    var std ='OD';
    // const lastNum = !!orderId ? +order.code.slice(-8) : 0;
    // const lastNum = !!orderId ? +orderId.slice(-8) : 0;
    var lastNum = orderId;
    var num = ('00000000' + (lastNum + 1)).slice(-8);
    return std + num;
}
function checkYearMonth(year, month) {
    if( month > 12 ) {
        // const newMonth = (month - 12);
        var numMonth = ('0' + (month - 12)).slice(-2);
        var newYear = (year + 1);
        return newYear +'-'+numMonth;
    }else{
        var numMonth = ('0' + month).slice(-2);
        var newYear = year;
        return newYear +'-'+numMonth;
    }
}
function daysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}
function monthsInMonth(year, month) {
    return new Date(year, month).getMonth();
}
function yearsInMonth(year, month) {
    return new Date(year, month).getFullYear();
}
function checkDays(day) {
    if( day.length !== 2) {
        var day = ('0' + day).slice(-2);
        return day;
    }else{
        return day;
    }
}
// add function genOrderODId //

// Show one_id last orders //
router.get(`/orderId`, function (req, res) {
    Order.findOne((err, result) => {
        if (err) throw err;

        if (result) {
            // res.json(result);
            // const NewODId = result.orderId;
            res.json(result);
            // console.log('o = ' + NewODId);
        }
        else {
            res.json([]);
            // const NewODId = (result.orderId + 1);
            // res.json([]);
            // console.log('- = ' + NewODId);
        }
        // }).sort({ orderId : 'desc'});
    }).sort({orderId: 'desc'}).limit(1);
});
// Show one_id last orders //

// add new orderId & orderODId //
router.post('/order', (req, res)=>{

    // var hashedPassword = bcrypt.hashSync(req.body.orderPassword, 8);
    // req.body.orderPassword = hashedPassword;
    // const Id = 0;
        Counter.findOne({'id': 'orderId'}, (err, resultC) => {
        if (err) throw err;

        if (resultC) {
            // res.json(resultC);

            // console.log('New ID = ' + genCode(resultC.seq));
            // const Id = (resultC.seq) + 1;
            // console.log('0 : Id = ' + Id);
            // console.log('0 : Id = ' + (resultC.seq + 1) );
            req.body.orderODId = genCode(resultC.seq);
            // console.log('req.body.orderODId = ' + req.body.orderODId);

            Order.create(req.body, (error, result)=>{

                // console.log('result : '+result);
                // console.log('error : '+error);
                if(error)
                {
                    return res.json({result: "failed", error: JSON.stringify(error)})
                }

                req.body.result = "Register Success"
                res.json(req.body)
            });
            console.log("Add Order to database" + req.body.orderODId);
            // console.log(req.body);
            // console.log('NewID_Last' + req.body.orderODId);
        } else {
            // res.json([]);
        }
    });
});
// add new orderId & orderODId //

// Show all orders
router.get(`/order`, function (req, res) {

    console.log("Show Order V1 (All)");
    Order.find((err, result) => {
        if (err) throw err;

        if (result) {
            res.json(result);
        } else {
            res.json([]);
        }
        // }).sort({ orderId : 'desc'});
    }).sort({ orderLastupdate : 'desc', orderId : 'desc'});
});

// Show all orders ByRangeDate //
router.get(`/order/date/:StartDate/:EndDate`, function (req, res) {

    // const startDate = req.params.StartDate;
    // const endDate = req.params.EndDate;
    // const startDate = '2019-02-01';
    // const endDate = '2019-02-28';
    // console.log("Show Order V1 ");
    console.log("Start date " + req.params.StartDate);
    console.log("End date " + req.params.EndDate);
    Order.find({
        // orderCreated: {
        //     // $gt: '2019-02-20T18:23:37.000Z',
        //     $gt: startDate,
        // }
        $and : [
            {
                orderCreated : {
                    $gte : req.params.StartDate
                    // $gte : req.params.StartDate+'T00:00:00.000Z'
                    // $gte : $$StartDate
                    // '$gte' : dateISO('2019-02-01')
                }
            },
            {
                orderCreated : {
                    $lte : req.params.EndDate
                    // $lte : req.params.EndDate+'T24:00:00.000Z'
                    // $lte : $$EndDate
                    // '$lte' : dateISO('2019-02-28')
                }
            }
        ]
    }, (err, result) => {
        if (err) throw err;

        if (result) {
            res.json(result);
        } else {
            res.json([]);
        }
        // }).sort({ orderId : 'desc'});
    }).sort({ orderLastupdate : -1, orderCreated : 'desc'});
});
// Show all orders ByRangeDate //

// Show all orders ByRangeDate //
router.get(`/order/date/:RangeDate`, function (req, res) {
    if (req.params.RangeDate.length !== 23) {
        return;
    }

    // const startDate = req.params.StartDate;
    // const endDate = req.params.EndDate;
    console.log("Show Order V1 (All) ByRangeDate = " + req.params.RangeDate);
    // const dd = req.params.RangeDate;
    const ddDate = req.params.RangeDate.split(' - ');
    console.log("RangeDate " + req.params.RangeDate);
    // console.log("ddDate 0 " + ddDate[0]);
    // console.log("ddDate 1 " + ddDate[1]);
    if(ddDate[0] && ddDate[1]) {
        // console.log("ddDate 0 " + ddDate[0]);
        // console.log("ddDate 1 " + ddDate[1]);
        const startDate = ddDate[0]+'T00:00:00.000Z';
        const endDate = ddDate[1]+'T24:00:00.000Z';
        Order.find({
            // orderCreated: {
            //     // $gt: '2019-02-20T18:23:37.000Z',
            //     $gt: startDate,
            // }
            $and : [
                {
                    orderCreated : {
                        $gte : startDate
                        // $gte : req.params.StartDate+'T00:00:00.000Z'
                        // $gte : $$StartDate
                        // '$gte' : dateISO('2019-02-01')
                    }
                },
                {
                    orderCreated : {
                        $lte : endDate
                        // $lte : req.params.EndDate+'T24:00:00.000Z'
                        // $lte : $$EndDate
                        // '$lte' : dateISO('2019-02-28')
                    }
                }
            ]
        }, (err, result) => {
            if (err) throw err;

            if (result) {
                res.json(result);
            } else {
                res.json([]);
            }
            // }).sort({ orderId : 'desc'});
        }).sort({ orderLastupdate : -1, orderCreated : -1});
    }

});
// Show all orders ByRangeDate //

// Show Order by id
// router.get(`/order/id/:id`, function (req, res) {
router.get(`/order/:id`, function (req, res) {

    // console.log("get for Show Order with id V1 -- view new --");
    Order.findOne({orderId: req.params.id}, (err, result) => {
        if (err) throw err;

        if (result) {
            res.json(result);
        } else {
            res.json([]);
        }
    });
});

// Get Product by keyword
router.get(`/order/name/:keyword`, function (req, res) {
    console.log("get order by keyword = " + req.params.keyword);
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

    // Order.find({ $or: [
    //             { productName: regx },
    //             { productCodename: regx } ] },

    // Order.find( {orderODId: regx } ,
    // console.log(req.params.keyword);
    Order.find( {orderODId: req.params.keyword} ,
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

// Update Order
router.put(`/order`, function (req, res) {
    console.log("Update Order V1 = " + req.body.orderId);
    // console.log("req.body.orderID " + req.body.orderId);
    // console.log("req.body.payment.method " + req.body.payment.method);

    Order.findOneAndUpdate({orderId: req.body.orderId}, req.body, (err, result) => {

        if(req.body.payment.method === 'banktranfer') {
            if ((result.payment.orderPaymentImage === '') || (result.payment.orderPaymentImage === null)) {
                // console.log('image is Null && ""');
            } else if (result.payment.orderPaymentImage === req.body.payment.orderPaymentImage) {
                // console.log('Same image');
            } else if ((result.payment.orderPaymentImage === '') && (req.body.payment.orderPaymentImage.length > 0)) {
                // console.log('Not same image');
            } else if ((result.payment.orderPaymentImage === null) && (req.body.payment.orderPaymentImage.length > 0)) {
                // console.log('file image cannot deleted but update new picture successfully');
                // console.log('<><> >> ' + req.body.payment.orderPaymentImage + " <++> " + result.payment.orderPaymentImage);
                // ถ้ามีไฟล์รูปภาพใหม่มาแทนที่ ให้ไฟล์ภาพเก่าทิ้งก่อน
                fs.unlink(`server/uploaded/images/payment/` + result.payment.orderPaymentImage, function (err) {
                    if (err) return console.log(err);
                    console.log('1-- file deleted successfully => ' + result.payment.orderPaymentImage);
                });
            }
            else if ((result.payment.orderPaymentImage.length > 0) && (req.body.payment.orderPaymentImage !== null)) {
                // console.log('file image cannot deleted but update new picture successfully');
                // console.log('<><> >> ' + req.body.payment.orderPaymentImage + " <++> " + result.payment.orderPaymentImage);
                // ถ้ามีไฟล์รูปภาพใหม่มาแทนที่ ให้ไฟล์ภาพเก่าทิ้งก่อน
                if(result.payment.orderPaymentImage.length === null){
                    console.log('NULL : ' + result.payment.orderPaymentImage.length);
                }

                fs.unlink(`server/uploaded/images/payment/` + result.payment.orderPaymentImage, function (err) {
                    if (err) return console.log(err);
                    // console.log('2--file deleted successfully => ' + result.payment.orderPaymentImage);
                });
            }
        }
        if(req.body.payment.method === 'cod') {
            if ((result.payment.orderPaymentImage === null) && (req.body.payment.orderPaymentImage === null)) {

            }else if ((result.payment.orderPaymentImage.length > 0) && (req.body.payment.orderPaymentImage === null)) {
                // console.log('file image cannot deleted but update new picture successfully');
                // console.log('<><> >> ' + req.body.payment.orderPaymentImage + " <++> " + result.payment.orderPaymentImage);
                // ถ้ามีไฟล์รูปภาพใหม่มาแทนที่ ให้ไฟล์ภาพเก่าทิ้งก่อน
                fs.unlink(`server/uploaded/images/payment/` + result.payment.orderPaymentImage, function (err) {
                    if (err) return console.log(err);
                    // console.log('2--file deleted successfully => ' + result.payment.orderPaymentImage);
                });
            }
        }


        if (err) throw err;

        const response = {result: "ok", message: "Updated"};
        // console.log("Update Order V1: " + req.body.id + ", " + JSON.stringify(result));
        // console.log("Update Order V1 Id: " + req.body.orderId);
        // console.log("Update Order V1 ODId: " + req.body.orderODId);
        // console.log("Update ImageData: " + req.body.payment.orderPaymentImage);
        // console.log("Update ImageTodatabase: " + result.payment.orderPaymentImage);
        res.json(response);
    });
});

// Update OrderBy ID set CheckedPrint //
router.put(`/order/:id`, function (req, res) {
    console.log("Update Order V1 = " + req.body.orderId);
    // console.log("req.body.orderID " + req.body.orderId);
    // console.log("req.body.payment.method " + req.body.payment.method);

    Order.findOneAndUpdate({orderId: req.body.orderId}, (err, result) => {

        if (err) throw err;

        const response = {result: "ok", message: "Updated"};
        // console.log("Update Order V1: " + req.body.id + ", " + JSON.stringify(result));
        res.json(response);
    });
});

// Delete Order by id
router.delete(`/order/:id`, function (req, res) {
    console.log("Delete Order V1 = " + req.params.id);
    // console.log('ID =' + req.params.id);
    Order.findOneAndRemove({orderId: req.params.id}, (err, result) => {
        // ถ้ามีไฟล์รูปภาพ  ให้ไฟล์ภาพเก่าทิ้งก่อน แล้วลบข้อมูลในดาต้าเบส
        // if ((result.payment.orderPaymentImage !== '') || (result.payment.orderPaymentImage !== null)) {
        if (result.payment.orderPaymentImage === null) {
            // console.log(result.payment.orderPaymentImage);
        }
        else if (result.payment.orderPaymentImage.length === 0) {
            // console.log(result.payment.orderPaymentImage);
        } else {
            fs.unlink(`server/uploaded/images/payment/` + result.payment.orderPaymentImage, function(err){
                if(err) return console.log(err);
                console.log('file deleted successfully => ' + result.payment.orderPaymentImage);
            });
        }

        if (err) throw err;

        const response = {result: "ok", message: "Removed"};
        res.json(response);
    });
});

// Upload file Order-Payment //
router.post(`/fileUploadOrderPayment`, function (req, res) {

    console.log("Upload File Order-Payment");

    try {
        const form = new formidable.IncomingForm();
        const newname = uniqid.time() + uniqid();
        form.parse(req, function (err, fields, files) {

            const oldpath = files['file'].path;
            const fileExtention = files['file'].name.split(".")[1];
            const newpath = path.resolve(`server/uploaded/images/payment`) + '/' + newname + "." + fileExtention;
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

//// Get API dashboard for report chart ////
//// Get API dashboard for report chart ////

// Show sale-report monthlyOfYear orders ByRangeYear //
router.get(`/dashboard/yearly/:rangeYearly`, function (req, res) {
    if (req.params.rangeYearly.length !== 4) {
        return;
    }

    console.log("Show Order V1 dashboard rangeYearly = " + req.params.rangeYearly);
    // const dd = req.params.RangeDate;
    // const ddDate = req.params.rangeYear.split(' - ');
    // console.log("rangeYearly = " + req.params.rangeYearly);
    // console.log("ddDate 0 " + ddDate[0]);
    // console.log("ddDate 1 " + ddDate[1]);
    if(req.params.rangeYearly) {
        // console.log("ddDate 0 " + ddDate[0]);
        // console.log("ddDate 1 " + ddDate[1]);
        // const startDate = req.params.rangeMonthly+'-01'+'T00:00';
        // const endDate = req.params.rangeMonthly+'-28'+'T24:00';

        // new API //
        var dateObj = new Date();
        var dateNow = (dateObj.getDate());
        const startDate = dateObj.getFullYear()+'-01-01T00:00:00.000Z';
        const endDate = dateObj.getFullYear()+'-12-31T24:00:00.000Z';
        // const maxEndDate = checkYearMonth(dateObj.getFullYear(), (dateObj.getMonth() + 2))+'-'+daysInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1))+'T00:00:00.000Z';
        // console.log('startDate = '+ startDate);
        // console.log('endDate = '+ endDate);
        // console.log('maxEndDate = ' + maxEndDate);
        // console.log('MaxDate = '+ daysInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1)));
        // console.log('MaxMonth = '+ monthsInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1)));
        // console.log('MaxYear = '+ yearsInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1)));
        var year = yearsInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1));
        // var month = ('0' + monthsInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1))).slice(-2);
        var maxmonth = monthsInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1));
        var monthnow = monthsInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1));
        var maxdate = ('0' + daysInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1))).slice(-2);

        // console.log('year-month-day = ' + year +'-' +month +'-'+ maxdate);
        // console.log('maxday = ' + maxdate);

        Order.aggregate(
            [
                { $match: {
//             userLevel: 'sale',
//                     $and: [
//                         {
//                             orderCreated: { $gte: new Date('2019-01-01T00:00:00.000Z') },
//                             orderCreated: { $lt: new Date('2019-03-01T00:00:00.000Z') }
//                             // orderCreated: { $gte: nDate },
//                             // orderCreated: { $lt: eDate }
//                         }
//                     ]
                        orderCreated: {
                            // $gte: "2019-01-01T00:00:00.000Z",
                            // $lt: "2019-02-01T00:00:00.000Z"
                            // $gte: new Date('2019-01-01T00:00:00.000Z'),
                            // $lt: new Date('2019-03-01T00:00:00.000Z')
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        }
                    }
                },
                {
                    $group : {
                        _id : { $dateToString : { format : '%Y-%m', date : '$orderCreated', timezone: 'Asia/Bangkok' } } ,
                        // _id : null ,

                        totalPrice : {
                            $sum : '$orderTotal'
                        },
                        count : {
                            $sum : 1
                        }
                    }
                },
                {
                    $sort : {
                        _id : 1
                    }
                }
            ], (err, result) => {
                if (err) throw err;

                // console.log('result = ' + result.length);
                // result.forEach(id => {
                //     console.log(id._id);
                // } );
                // const _id_result = result.filter()
                if (result) {

                    for(var i = 1; i <= monthnow; i++) {
                        // console.log('I = ' + checkDays(i));
                        var _id = year+ '-'+checkDays(i);
                        // console.log('result._id = ' + result._id);
                        const _id_result = result.find(req_id => req_id._id == _id);
                        // console.log('_id_result = ' + _id_result);
                        if(_id_result) {
                            // console.log('_id = ' + _id_result);
                            result.find(req => {
                                if(req._id == _id) {
                                    req.days = i;
                                    req.dayNum = i;
                                    req.dayStr = _id;
                                }
                            });
                            //     result._id = result._id;
                            //     result.totalPrice = result.totalPrice;
                            //     result.count = result.count;
                        } else {
                            // console.log('_id !== ' + _id + ' = ' + _id_result);
                            result.push({
                                _id: _id,
                                totalPrice: 0,
                                count: 0,
                                days: i,
                                dayNum: i,
                                dayStr: _id,
                            });
                        }

                    }
                    // return result;
                    res.json(result);
                } else {
                    res.json([]);
                }
            }
        )
        // .sort({ days: 1, dayNum: 1,_id: 1 });
        // new API //
    }

});
// Show sale-report monthlyOfYear orders ByRangeYear //
// Show monthly-report orders ByRangeDateOfMonth //

router.get(`/dashboard/monthly/:rangeMonthly`, function (req, res) {

    if (req.params.rangeMonthly.length !== 7) {
        return ;
    }
    // const startDate = req.params.StartDate;
    // const endDate = req.params.EndDate;
    console.log("Show Order V1 dashboard rangeMonthly = " + req.params.rangeMonthly);
    // const dd = req.params.RangeDate;
    // const ddDate = req.params.rangeYear.split(' - ');
    // console.log("rangeMonthly = " + req.params.rangeMonthly);
    // console.log("ddDate 0 " + ddDate[0]);
    // console.log("ddDate 1 " + ddDate[1]);
    if(req.params.rangeMonthly) {

        // new API //
        // const nDate = "2019-01-01T00:00:00.000Z";
        // const eDate = "2019-02-01T00:00:00.000Z";
        var dateObj = new Date();
        var dateNow = (dateObj.getDate());
        const startDate = checkYearMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1))+'-01'+'T00:00:00.000Z';
        const endDate = checkYearMonth(dateObj.getFullYear(), (dateObj.getMonth() + 2))+'-'+checkDays(dateNow)+'T24:00:00.000Z';
        const maxEndDate = checkYearMonth(dateObj.getFullYear(), (dateObj.getMonth() + 2))+'-'+daysInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1))+'T00:00:00.000Z';
        // console.log('startDate = '+ startDate);
        // console.log('endDate = '+ endDate);
        // console.log('maxEndDate = ' + maxEndDate);
        // console.log('MaxDate = '+ daysInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1)));
        // console.log('MaxMonth = '+ monthsInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1)));
        // console.log('MaxYear = '+ yearsInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1)));
        var year = yearsInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1));
        var month = ('0' + monthsInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1))).slice(-2);
        var maxdate = ('0' + daysInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1))).slice(-2);

        // console.log('year-month-day = ' + year +'-' +month +'-'+ maxdate);
        // console.log('maxday = ' + maxdate);

        Order.aggregate(
        [
            { $match: {
//             userLevel: 'sale',
//                     $and: [
//                         {
//                             orderCreated: { $gte: new Date('2019-01-01T00:00:00.000Z') },
//                             orderCreated: { $lt: new Date('2019-03-01T00:00:00.000Z') }
//                             // orderCreated: { $gte: nDate },
//                             // orderCreated: { $lt: eDate }
//                         }
//                     ]
                    orderCreated: {
                        // $gte: "2019-01-01T00:00:00.000Z",
                        // $lt: "2019-02-01T00:00:00.000Z"
                        // $gte: new Date('2019-01-01T00:00:00.000Z'),
                        // $lt: new Date('2019-03-01T00:00:00.000Z')
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                }
            },
            {
                $group : {
                    _id : { $dateToString : { format : '%Y-%m-%d', date : '$orderCreated', timezone: 'Asia/Bangkok' } } ,
                    // _id : null ,

                    totalPrice : {
                        $sum : '$orderTotal'
                    },
                    count : {
                        $sum : 1
                    }
                }
            },
            {
                $sort : {
                    _id : 1
                }
            }
        ], (err, result) => {
                if (err) throw err;

                // console.log('result = ' + result.length);
                // result.forEach(id => {
                //     console.log(id._id);
                // } );
                // const _id_result = result.filter()
                if (result) {

                    for(var i = 1; i <= (dateNow); i++) {
                        // console.log('I = ' + checkDays(i));
                        var _id = year+ '-'+month+'-'+checkDays(i);
                        // console.log('result._id = ' + result._id);
                        const _id_result = result.find(req_id => req_id._id == _id);
                        // console.log('_id_result = ' + _id_result);
                        if(_id_result) {
                            // console.log('_id = ' + _id_result);
                            result.find(req => {
                                if(req._id == _id) {
                                    req.days = i;
                                    req.dayNum = i;
                                    req.dayStr = _id;
                                }
                            });
                                //     result._id = result._id;
                                //     result.totalPrice = result.totalPrice;
                                //     result.count = result.count;
                        } else {
                            // console.log('_id !== ' + _id + ' = ' + _id_result);
                            result.push({
                                _id: _id,
                                totalPrice: 0,
                                count: 0,
                                days: i,
                                dayNum: i,
                                dayStr: _id,
                            });
                        }

                    }
                    // return result;
                    res.json(result);
                } else {
                    res.json([]);
                }
            }
        )
        // new API //
    }

});
// Show monthly-report orders ByRangeDateOfMonth //

// Show orderSeller-report orders ByRangeDateOfMonthAndYear //
router.get(`/dashboard/monthly-sale/:rangeSaleMonthly`, function (req, res) {

    if (req.params.rangeSaleMonthly.length !== 7) {
        return ;
    }
    // const startDate = req.params.StartDate;
    // const endDate = req.params.EndDate;
    console.log("Show Order V1 dashboard rangeSaleMonthly = " + req.params.rangeSaleMonthly);
    // const dd = req.params.RangeDate;
    // const ddDate = req.params.rangeYear.split(' - ');
    // console.log("rangeSaleMonthly = " + req.params.rangeSaleMonthly);
    // console.log("ddDate 0 " + ddDate[0]);
    // console.log("ddDate 1 " + ddDate[1]);
    if(req.params.rangeSaleMonthly) {
        var dateObj = new Date();
        var dateNow = (dateObj.getDate());
        const startDate = checkYearMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1))+'-01'+'T00:00:00.000Z';
        const endDate = checkYearMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1))+'-'+checkDays(dateNow)+'T24:00:00.000Z';
        const maxEndDate = checkYearMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1))+'-'+daysInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1))+'T24:00:00.000Z';
        // console.log('startDate = '+ startDate);
        // console.log('endDate = '+ endDate);
        // console.log('maxEndDate = ' + maxEndDate);
        // console.log('MaxDate = '+ daysInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1)));
        // console.log('MaxMonth = '+ monthsInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1)));
        // console.log('MaxYear = '+ yearsInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1)));
        var year = yearsInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1));
        var month = ('0' + monthsInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1))).slice(-2);
        var maxdate = ('0' + daysInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1))).slice(-2);

        // console.log('year-month-day = ' + year +'-' +month +'-'+ maxdate);
        // console.log('maxday = ' + maxdate);

        Order.aggregate(
            [
                {
                    $lookup : {
                        from : 'users',
                        localField : 'orderSellerId',
                        foreignField : 'userId',
                        as : 'fromUsers'
                    }
                },
                {
                    $replaceRoot : {
                        newRoot : {
                            $mergeObjects : [
                                {
                                    $arrayElemAt : [
                                        '$fromUsers',
                                        0
                                    ]
                                },
                                '$$ROOT'
                            ]
                        }
                    }
                },
                {
                    $project : {
                        'fromUsers' : 0
                    }
                },
                {
                    $match : {
                        userLevel : 'sale',
                        $and : [
                            {
                                orderCreated : {
                                    // $gte : ISODate('2019-02-01T00:00:00.000+0000Z')
                                    $gte : new Date( startDate)
                                }
                            },
                            {
                                orderCreated : {
                                    // $lte : ISODate('2019-02-28T24:00:00.000+0000Z')
                                    $lte : new Date(maxEndDate)
                                }
                            }
                        ]
                    }
                },
                {
                    $group : {
                        _id : '$userName',
                        totalPrice : {
                            $sum : '$orderTotal'
                        },
                        sumCount : {
                            $sum : 1
                        }
                    }
                },
                {
                    $sort : {
                        totalPrice : -1
                    }
                }

            ], (err, result) => {
                if (err) throw err;
                // console.log('result = ' + result.length);
                if (result) {
                    res.json(result);
                } else {
                    res.json([]);
                }
            }
        )
        // new API //
    }

});
// Show orderSeller-report orders ByRangeDateOfMonthAndYear //

// Show orderSeller-reportYear orders ByRangeDateOfMonthAndYear //
router.get(`/dashboard/yearly-sale/:rangeSaleYearly`, function (req, res) {

    if (req.params.rangeSaleYearly.length !== 4) {
        return ;
    }
    // const startDate = req.params.StartDate;
    // const endDate = req.params.EndDate;
    console.log("Show Order V1 dashboard rangeSaleYearly = " + req.params.rangeSaleYearly);
    // const dd = req.params.RangeDate;
    // const ddDate = req.params.rangeYear.split(' - ');
    // console.log("rangeSaleYearly = " + req.params.rangeSaleYearly);
    // console.log("ddDate 0 " + ddDate[0]);
    // console.log("ddDate 1 " + ddDate[1]);
    if(req.params.rangeSaleYearly) {
        var dateObj = new Date();
        var dateNow = (dateObj.getDate());
        const startDate = dateObj.getFullYear()+'-01-01T00:00:00.000Z';
        const endDate = dateObj.getFullYear()+'-12-31T24:00:00.000Z';
        // const maxEndDate = checkYearMonth(dateObj.getFullYear(), (dateObj.getMonth() + 2))+'-'+daysInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1))+'T00:00:00.000Z';
        // console.log('startDate = '+ startDate);
        // console.log('endDate = '+ endDate);
        // console.log('maxEndDate = ' + maxEndDate);
        // console.log('MaxDate = '+ daysInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1)));
        // console.log('MaxMonth = '+ monthsInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1)));
        // console.log('MaxYear = '+ yearsInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1)));
        var year = yearsInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1));
        // var month = ('0' + monthsInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1))).slice(-2);
        var maxmonth = monthsInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1));
        var monthnow = monthsInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1));
        var maxdate = ('0' + daysInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1))).slice(-2);

        // console.log('year-month-day = ' + year +'-' +month +'-'+ maxdate);
        // console.log('maxday = ' + maxdate);

        Order.aggregate(
            [
                {
                    $lookup : {
                        from : 'users',
                        localField : 'orderSellerId',
                        foreignField : 'userId',
                        as : 'fromUsers'
                    }
                },
                {
                    $replaceRoot : {
                        newRoot : {
                            $mergeObjects : [
                                {
                                    $arrayElemAt : [
                                        '$fromUsers',
                                        0
                                    ]
                                },
                                '$$ROOT'
                            ]
                        }
                    }
                },
                {
                    $project : {
                        'fromUsers' : 0
                    }
                },
                {
                    $match : {
                        userLevel : 'sale',
                        $and : [
                            {
                                orderCreated : {
                                    // $gte : ISODate('2019-02-01T00:00:00.000+0000Z')
                                    $gte : new Date(startDate)
                                }
                            },
                            {
                                orderCreated : {
                                    // $lte : ISODate('2019-02-28T24:00:00.000+0000Z')
                                    $lte : new Date(endDate)
                                }
                            }
                        ]
                    }
                },
                {
                    $group : {
                        _id : '$userName',
                        totalPrice : {
                            $sum : '$orderTotal'
                        },
                        sumCount : {
                            $sum : 1
                        }
                    }
                },
                {
                    $sort : {
                        totalPrice : -1
                    }
                }

            ], (err, result) => {
                if (err) throw err;
                // console.log('result = ' + result.length);
                if (result) {
                    res.json(result);
                } else {
                    res.json([]);
                }
            }
        )
        // new API //
    }

});
// Show orderSeller-reportYear orders ByRangeDateOfMonthAndYear //

//// Get API dashboard for report chart ////
//// Get API dashboard for report chart ////

module.exports = router;
