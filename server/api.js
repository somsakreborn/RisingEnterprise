const express = require('express');
const router = express.Router();

// const User = require('./models/user_schema');
// const Employee = require('./models/employee_schema');
// const Branch = require('./models/branch_schema');
// const Bank = require('./models/bank_schema');
// const Shipment = require('./models/shipment_schema');
// const Counter = require('./models/counter_schema');
// const Category = require('./models/category_schema');
// const Product = require('./models/product_schema');
// const VerifyToken = require('./auth/VerifyToken');

const AuthenAPI = require('./api_auth');
const UserAPI = require('./api_user');
const EmployeeAPI = require('./api_employee');
const BranchAPI = require('./api_branch');
const BankAPI = require('./api_bank');
const ShipmentAPI = require('./api_shipment');
const CounterAPI = require('./api_counter');
const CategoryAPI = require('./api_category');
const CustomerAPI = require('./api_customer');
const ProductAPI = require('./api_product');
const InventoryAPI = require('./api_inventory');
const WarehouseAPI = require('./api_warehouse');
const ChannelAPI = require('./api_channel');
const OrderAPI = require('./api_order');
const ReportOrderAPI = require('./api_reportOrders');
const PixelAPI = require('./api_pixel');

router.use(AuthenAPI);
router.use(UserAPI);
router.use(EmployeeAPI);
router.use(BranchAPI);
router.use(BankAPI);
router.use(ShipmentAPI);
router.use(CounterAPI);
router.use(CategoryAPI);
router.use(ProductAPI);
router.use(CustomerAPI);
router.use(InventoryAPI);
router.use(WarehouseAPI);
router.use(ChannelAPI);
router.use(OrderAPI);
router.use(ReportOrderAPI);
router.use(PixelAPI);

module.exports = router;
