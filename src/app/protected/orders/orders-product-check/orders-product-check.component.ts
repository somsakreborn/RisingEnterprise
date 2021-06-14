import {Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {environment as env} from '../../../../environments/environment';

// import {Observable, Subject, ReplaySubject, from, of, range, Subscription} from 'rxjs';
import {map, filter, switchMap, debounceTime, distinctUntilChanged} from 'rxjs/operators';
import 'rxjs/add/operator/map';
import {Observable, Subscription, forkJoin, of} from 'rxjs';
import * as _ from 'lodash';

// import customer data API //
import {CustomersService} from '../../customers/customers.service';
import {Customer} from '../../customers/customers.interface';

// import channel data API //
import {ChannelsService} from '../../channels/channels.service';
import {Channel} from '../../channels/channels.interface';
// import shipment data API //
import {ShipmentService} from '../../shipments/shipments.service';
import {Shipment} from '../../shipments/shipments.interface';
// import shipment data API //
import {BankService} from '../../banks/banks.service';
import {Bank} from '../../banks/banks.interface';
// import product data API //
import {ProductsService} from '../../products/products.service';
import {Product} from '../../products/products.interface';
// import order data API //
import {Order, Products} from '../../orders/orders.interface';
import {OrdersService} from '../../orders/orders.service';
// import order data API //
import {Counter} from '../../products/counter.interface';
import {CounterService} from '../../products/counter.service';

// declare var $: any;
declare const $;

import Swal from 'sweetalert2';

import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-orders-product-check',
  templateUrl: './orders-product-check.component.html',
  styleUrls: ['./orders-product-check.component.scss']
})
export class OrdersProductCheckComponent implements OnInit, OnDestroy {

    // add data test //
    // @ViewChild('orderFormModal') orderFormModal;
    @ViewChild('Image') Image: ElementRef;
    @Input() orderProducts = [];
    // @Input() orderCustomer = [];
    // @Input() trackingNumber = '';
    @Input() disabled = false;
    // @Input() isUpdate = false;

    // @Input() customerForm = new FormGroup();
    @Input() orderForm: FormGroup;
    @Input() customerForm: FormGroup;
    @Input() paymentForm: FormGroup;
    @Input() deliveryForm: FormGroup;
    @Input() OrderCreateForm: FormGroup;
    @Input() OrderEditForm: FormGroup;
    @Input() ngForm: FormGroup;

    @Output() changedFile = new EventEmitter();
    @Output() submittedOrder = new EventEmitter();
    @Output() resetForm = new EventEmitter();
    // public maskUsAmount = createNumberMask({
    //     prefix: ''
    // });

    // public emailMask = [/[0-9,A-z]/, /\d/, /\d/];
    public maskUsbank = [/[0-9]/, /\d/, /\d/, '-', /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/];
    public maskUsTime = [/[0-2]/, /[0-9]/, ':', /[0-5]/, /\d/];

    searchProducts: any;
    checkProducts: boolean;
    checkWaitProducts: boolean;
    countProducts: number;
    x: number;
    y: number;
    // OrderForm: FormGroup;
    // submitted: boolean;
    submitted = false;
    isReadOnly = false;
    productsCompleteCheck = false;
    checkDisable: boolean;

    selectedValue: string;
    selectedOption: any;

    mID: any;
    // public model: any;
    public model2: any;
    public modelCustomers: any;
    public modelProvince: any;

    xxx: number;
    fileToUpload: File = null;
    imageUrl = env.serverAPI + '/images/image-blank.jpg';
    imageUrlBlank = env.serverAPI + '/images/image-blank.jpg';
    imageUrlProduct = env.serverAPI + '/images/image-blank.jpg';
    customer: Customer = {} as Customer;
    customers: Customer[] = [] as Customer[];
    channel: Channel = {} as Channel;
    channels: Channel[] = [] as Channel[];
    shipment: Shipment = {} as Shipment;
    shipments: Shipment[] = [] as Shipment[];
    product: Product = {} as Product;
    productHold: Product = {} as Product;
    products: Product[] = [] as Product[];
    dataProducts: Product[] = [] as Product[];
    bank: Bank = {} as Bank;
    banks: Bank[] = [] as Bank[];
    order: Order = {} as Order;
    orders: Order[] = [] as Order[];
    dataOrder: Order = {} as Order;
    oldOrderProduct: Products[] = [] as Products[];

    orderPrice: number;
    orderDiscount: number;
    orderShipmentId: number;
    orderShipmentName: string;
    orderBankId: number;
    orderBankIdDefualt: number;
    orderMethod: string;
    orderPaymentDate: any;
    orderPaymentTime: any;
    orderPaymentImage: any;
    orderPaymentImageOld: any;
    paymentDate: any;
    method: 'cod';
    checkEditStatus: string;
    // test str replace //
    ODId: any;
    rex: number;
    orderODId: string;
    // counter: Counter;
    counterODId: Counter = {} as Counter;
    // test str replace //

    public model: any;
    today: number = Date.now();
    modelPopup: NgbDateStruct = {} as NgbDateStruct;
    modelPopupOrderLastupdate: NgbDateStruct;

    modelTime: NgbTimeStruct = {} as NgbTimeStruct;

    public date: { year: number, month: number, day: number };

    isSelected = true;
    saving = false;

    selectedFile = null;
    resetFileDefault = '';
    showImg = '';
    orderCache = '';

    ID: number;
    Name: string;
    checkRole: string;
    editID: number;
    editName: string;
    // Image: any;

    private sub: Subscription = null;
    private dataSub: Subscription = null;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        private customerService: CustomersService,
        private channelService: ChannelsService,
        private shipmentService: ShipmentService,
        private productService: ProductsService,
        private bankService: BankService,
        private orderService: OrdersService,
        private counterService: CounterService,
        private formBuilder: FormBuilder
    ) {

        const today = new Date();
        const dd = today.getDate();
        const mm = today.getMonth() + 1;
        const yyyy = today.getFullYear();
        const hour = today.getHours();
        const minute = today.getMinutes();
        const second = today.getSeconds();

        // const time = <NgbTimeStruct>{hour: today.getHours(), minute: today.getMinutes()};

        this.modelPopup.day = dd;
        this.modelPopup.month = mm;
        this.modelPopup.year = yyyy;
        this.modelTime.hour = hour;
        this.modelTime.minute = minute;
        this.modelTime.second = second;
        // this.modelTime = time;
    }

  ngOnInit() {
      // this.fetchViewOrderODId(this.mID);
      this.ID = JSON.parse(localStorage.getItem('ID'));
      this.Name = JSON.parse(localStorage.getItem('Name'));
      this.checkRole = JSON.parse(localStorage.getItem('Role'));

      this.customerForm = this.formBuilder.group({
          orderCustomerChannelId: ['', Validators.required],
          orderCustomerIdhome: ['', [Validators.required, Validators.minLength(2)]],
          orderCustomerId: ['', Validators.required],
          orderCustomerCMId: ['', Validators.required],
          orderCustomerNameSurname: ['', Validators.required],
          orderCustomerSocial: ['', Validators.required],
          orderCustomerTel: ['', [
              Validators.required,
              Validators.pattern(/^(06|08|09)[0-9]*/),
              Validators.minLength(10),
              Validators.maxLength(10)
          ]],
          address2: ['', Validators.required],
          zipcode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]]
      });
      this.paymentForm = new FormGroup({
          orderShipmentId:  new FormControl(),
          orderBankId:  new FormControl(),
          orderPaymentDate:  new FormControl(),
          orderPaymentTime:  new FormControl(),
          orderPaymentImage:  new FormControl(),
          // file: new FormControl(),
          // image: new FormControl(),
          // orderTime:  new FormControl(),
          method:  new FormControl()
      });
      // this.deliveryForm = new FormGroup({
      this.deliveryForm = this.formBuilder.group( {
          // delivery: new FormControl(),
          // deliveryId: new FormControl(),
          price: [0]
      });
      // this.orderForm = new FormGroup({
      this.orderForm = this.formBuilder.group({
          orderId: [],
          orderODId: [''],
          orderDiscount: [0],
          discount: [0],
          total: [0]
      });

      this.fetchCustomer();
      this.fetchShipment();
      this.fetchChannel();
      this.fetchBank();

      this.setJqueryThailand();
      // console.log(this.setJqueryThailand());
      // console.log(JSON.stringify(this.customers.filter(x => x.customerId)));
  }

  onScanOrdersProduct(orderODId: string) {
      this.mID = orderODId;
      this.checkProducts = false;
      this.checkWaitProducts = false;
      this.checkDisable = false;

      if (orderODId.length === 10) {
          this.orderService.fetchViewOrderODId(this.mID)
              .map((m: Order) => {
                  const ddStart = new Date(m[0].payment.orderPaymentDate);
                  this.modelPopupOrderLastupdate = {year: ddStart.getFullYear(), month: ddStart.getMonth() + 1, day: ddStart.getDate()};

                  if (m[0].products.length > 0) {
                      m[0].products.forEach((pp: Products) => {

                         this.productService.fetchViewProductCodename(pp.code)
                              .map((mm) => {
                                  if (mm.productCodename === pp.code) {
                                      pp.max = (mm.productTotal - mm.productHold);
                                      pp.remain = (mm.productTotal - mm.productHold);
                                      pp.checkamount = 0;
                                  }
                                  return mm;
                              })
                              .subscribe((rr: Product[]) => {
                                  return rr;
                              });
                      });
                  }
                  return m;

              })
              .subscribe((r: Order) => {

                  if ((r[0].orderStatusCode === 2) && (r[0].orderStatusName === 'print')) {
                      this.order = r;
                      this.orderPrice = r[0].delivery.price;
                      this.orderDiscount = r[0].orderDiscount;
                      this.editID = r[0].orderSellerId;
                      this.editName = r[0].orderSellerName;
                      this.orderShipmentId = r[0].payment.orderShipmentId;
                      this.orderBankId = r[0].payment.orderBankId;
                      this.orderMethod = r[0].payment.method;
                      this.orderPaymentDate = r[0].payment.orderPaymentDate;
                      this.orderPaymentTime = r[0].payment.orderPaymentTime;
                      this.orderPaymentImage = r[0].payment.orderPaymentImage;
                      this.orderPaymentImageOld = r[0].payment.orderPaymentImage;
                      this.orderProducts = r[0].products;
                      this.order.orderId = r[0].orderId;
                      this.order.orderODId = r[0].orderODId;
                      this.order.orderStatusCode = r[0].orderStatusCode;
                      this.order.orderStatusName = r[0].orderStatusName;
                      this.order.orderChannelId = r[0].orderChannelId;
                      this.order.customer = r[0].customer;
                      this.order.delivery = r[0].delivery;
                      this.order.orderDiscount = r[0].orderDiscount;
                      this.order.orderTotal = r[0].orderTotal;
                      this.order.customer = r[0].customer;
                      this.order.orderRemark = r[0].orderRemark;
                      this.order.historys = r[0].historys;
                      this.shipments.filter((req: Shipment) => {
                          if (req.shipmentId === this.orderShipmentId) { return this.orderShipmentName = req.shipmentName; }
                      });
                      this.checkWaitProducts = true;
                      this.alertSuccessWaitSound(`รายการสินค้านี้ (${orderODId}) ถูกต้องครับ \nทำการสแกนรายการสินค้าต่อไป`);
                      (<HTMLInputElement>document.getElementById('ordersODId')).value = '';
                      (<HTMLInputElement>document.getElementById('productCodename')).focus();

                  // } else if ((r[0].orderStatusCode === 3) && (r[0].orderStatusName === 'pack')) {
                  } else if ((r[0].orderStatusCode >= 3)) {
                      this.order = r;
                      this.alertSuccessSound( `Complete Orders !!! \nออเดอร์นี้ทำการคอนเฟิร์มออเดอร์ไปเรียบร้อยแล้ว (${orderODId})
                      กระบวนการถัดไป ("${r[0].orderStatusName}" ลำดับที่ ${r[0].orderStatusCode})`);
                      this.orderPrice = r[0].delivery.price;
                      this.orderDiscount = r[0].orderDiscount;
                      this.editID = r[0].orderSellerId;
                      this.editName = r[0].orderSellerName;
                      this.orderShipmentId = r[0].payment.orderShipmentId;
                      this.orderBankId = r[0].payment.orderBankId;
                      this.orderMethod = r[0].payment.method;
                      this.orderPaymentDate = r[0].payment.orderPaymentDate;
                      this.orderPaymentTime = r[0].payment.orderPaymentTime;
                      this.orderPaymentImage = r[0].payment.orderPaymentImage;
                      this.orderPaymentImageOld = r[0].payment.orderPaymentImage;
                      this.orderProducts = r[0].products;
                      this.order.orderId = r[0].orderId;
                      this.order.orderODId = r[0].orderODId;
                      this.order.orderStatusCode = r[0].orderStatusCode;
                      this.order.orderStatusName = r[0].orderStatusName;
                      this.order.orderChannelId = r[0].orderChannelId;
                      this.order.customer = r[0].customer;
                      this.order.delivery = r[0].delivery;
                      this.order.orderDiscount = r[0].orderDiscount;
                      this.order.orderTotal = r[0].orderTotal;
                      this.order.customer = r[0].customer;
                      this.order.orderRemark = r[0].orderRemark;
                      this.order.historys = r[0].historys;
                      this.shipments.filter((req: Shipment) => {
                          if (req.shipmentId === this.orderShipmentId) { return this.orderShipmentName = req.shipmentName; }
                      });
                      this.checkProducts = false;
                      this.checkDisable = true;
                  } else {
                      this.order.orderStatusName = r[0].orderStatusName;
                      this.alertErrorSound(`Warning Alert :\nคำสั่งซื้อรายการนี้ ("${orderODId}")
                      อยู่ในกระบวนการ ("${r[0].orderStatusName}" ลำดับที่ ${r[0].orderStatusCode}) \nกรุณาตรวจสอบอีกครั้งครับ`);
                      if (this.orderProducts) {
                          this.orderProducts = [];
                          this.order.orderODId = '';
                          this.order.orderId = '';
                      }
                      (<HTMLInputElement>document.getElementById('ordersODId')).value = '';
                      (<HTMLInputElement>document.getElementById('ordersODId')).focus();
                      return false;
                  }
                  // this.alertSuccess(orderODId);
              });

          // (<HTMLInputElement>document.getElementById('ordersODId')).value = '';
      }
      if (orderODId.length !== 10) {

          if (this.orderProducts) {
              this.orderProducts = [];
              this.order.orderODId = '';
              this.order.orderId = '';
          }
          // console.log('O3 = ' + orderODId.length);
          // (<HTMLInputElement>document.getElementById('ordersODId')).value = '';

          this.alertErrorSound('wrong data!!!');
          // this.clearSearchProducts();
          (<HTMLInputElement>document.getElementById('ordersODId')).value = '';
          (<HTMLInputElement>document.getElementById('ordersODId')).focus();
          // return false;
      }
  }

    findProductCodename(value) {
            if ((this.checkDisable === true) || (value.length === 0)) {
                return false;
            }
            if ((value.length >= 4) && (value.length <= 10) && (value.length !== 0)) {

                const notExistInProducts = this.orderProducts
                    .find((p: Products) => (p.code === value && p.amount >= p.checkamount));

                if (notExistInProducts) {
                    // console.log(JSON.stringify('Yes : ' + notExistInProducts));
                    // this.alertSuccessSound('true');
                    this.orderProducts.filter((req: Products) => {
                        if (value === req.code) {
                            if (req.checkamount < req.amount) {
                                req.checkamount = (req.checkamount + 1);
                                this.pushCheckProducts(req, null);
                                this.alertSuccessSound(`Complete Data :\nข้อมูล SKU นี้ถูกต้องครับ
                                        (SKU) ${value} => จำนวน ${req.checkamount} Pcs.`);
                                (<HTMLInputElement>document.getElementById('productCodename')).value = '';
                            } else {
                                this.alertErrorSound(`Same Data : \nข้อมูลนี้ถูกยิงเข้าไปแล้ว (ซ้ำ)`);
                                (<HTMLInputElement>document.getElementById('productCodename')).value = '';
                            }
                        }
                    });
                } else {
                    // console.log(JSON.stringify('else : ' + notExistInProducts));
                    // this.alertErrorSound('false');
                    this.alertErrorSound('Warning False : \nข้อมูลสินค้าไม่ตรงกับรายการคำสั่งซื้อ');
                    (<HTMLInputElement>document.getElementById('productCodename')).value = '';
                }

            } else {
                this.alertErrorSound(`Wrong Data : \nข้อมูล SKU ต้องมากกว่า 4 ตัวอักษร`);
                (<HTMLInputElement>document.getElementById('productCodename')).value = '';
            }

        if (this.onSubmitCheck()) {
                this.checkProducts = true;
                this.alertSuccessSound( `<<<<< COMPLETE DATA SCAN... (${this.order.orderODId}) >>>>>`);
                this.onSubmitOrdersCheck(this.order.orderODId);
            }
    }

    pushCheckProducts(products, size = null) {
        if (products.remain === 0) { return; }
        let pid = products.id;
        let code = products.code;
        let name = products.name;
        let max = products.max;
        let remain = products.remain;
        let checkamount = products.checkamount;
        const notExistInOrderProduct = this.orderProducts
            .find(p => p.id === pid);
        // alert(notExistInOrderProduct);

        if (!notExistInOrderProduct) {
            this.orderProducts.push({
                id: products.id,
                code: code,
                name: name,
                price: products.price,
                amount: products.amount,
                max: max,
                remain: remain,
                checkamount: checkamount,
                total: products.total,
                image: products.image
            });
        }

        if (this.onSubmitCheck()) {
            this.checkProducts = true;
        } else {
            this.checkProducts = false;
        }
        // (<HTMLInputElement>document.getElementById('searchProductInput')).value = '';
        // this.clearSearchProducts();
        // this.calTotalOrder();
    }
    onSubmitCheck() {
        // console.log(orderODId);
        // this.alertSuccess(orderODId);
        // console.log(JSON.stringify(this.orderProducts));
        this.countProducts = this.orderProducts.length;
        this.checkProducts = false;
        this.x = 0; // false
        this.y = 0; // true
        this.orderProducts.forEach((r: Products) => {
            if (r.amount !== r.checkamount) {
                this.x++;
            } else {
                this.y++;
            }
        });

        if (this.x > 0) {
            return false;
        }

        if ((this.y > 0) && (this.y === this.countProducts)) {
            return true;
        }
    }
    onSubmitOrdersCheck(orderODId) {
        // console.log(orderODId);
        // this.alertSuccess(orderODId);
        // console.log(JSON.stringify(this.orderProducts));
        this.countProducts = this.orderProducts.length;
        this.checkProducts = false;
        this.x = 0; // false
        this.y = 0; // true
        this.orderProducts.forEach((r: Products) => {
            if (r.amount !== r.checkamount) {
                this.x++;
            } else {
                this.y++;
                if (this.y === this.countProducts) {
                    this.checkProducts = true;
                }
            }
        });

        if (this.x > 0) {
            this.alertErrorSound('FALSE : \n เกิดข้อมูลผิดพลาด คุณสแกนรหัสสินค้ายังไม่ครบ กรุณาตรวจสอบอีกครับ!!!');
            return false;
        }

        if ((this.y > 0) && (this.y === this.countProducts)) {
            if (this.checkProducts) {
                // [selected  === this.order => this.order.orderODId]  to checkedScanbarPackUp //
                this.checkedScanbarToPack(this.order);

                this.alertSuccessSound(`Complete Orders (${orderODId}) : \nข้อมูลถูกต้อง. ถูกทำการอัพเดทเรียบร้อยแล้วครับ`);
                setTimeout(() => window.location.reload(true), 3500);
            }
        }

    }
    // [selected  === this.order => this.order.orderODId]  to checkedScanbarPackUp //
    async checkedScanbarToPack(selected) {
        if (this.checkStatusProcess(selected, 2, 'print')) {
            // alert('true =');
            // let data = '';
            let dataTrue = 0;
            if (selected.length > 0) {
                await selected.forEach(sel => {
                    if (selected) {
                        this.order = sel;
                        if ((sel.orderStatusCode === 2) && (sel.orderStatusName === 'print')) {
                            dataTrue++;
                            this.order.orderId = sel.orderId;
                            this.order.orderODId = sel.orderODId;
                            // checked update product to stock checked //
                            let x = 0;

                            sel.products.forEach((u: Products) => {
                                x = x + 1;
                                // console.log('Update data to Stock ID : ' + u.id + ' , amount : ' + u.amount);
                                // update stock new value //
                                this.productService.fetchViewProductId(u.id)
                                    .subscribe((r: Product) => {
                                        this.product = r;
                                        this.product.productId = r.productId;

                                        if (r.productId === u.id) {
                                            // console.log('N : ' + x);
                                            const newItemTotal = ((Number(r.productTotal) - Number(u.amount)));
                                            const newItemHold = ((Number(r.productHold) - Number(u.amount)));
                                            const newItemRemain = ((Number(newItemTotal) - Number(newItemHold)));
                                            const newItemUpdateStock = `${r.productTotal} - ${u.amount} => ${newItemTotal}`;
                                            const newItemUpdateHold = `${r.productHold} - ${u.amount} => ${newItemHold}`;
                                            const newItemUpdateRemain = `${newItemTotal} - ${newItemHold} => ${newItemRemain}`;

                                            this.product.productTotal = newItemTotal;
                                            this.product.productHold = newItemHold;
                                            this.product.productLastupdate = new Date();
                                            // add historys //
                                            const PhisName = `ScanToBalanceStock`;
                                            // const PhisRemark = '' + sel.orderODId + '\nลดสต็อกสินค้าจำนวน(Stock)' + newItemUpdateStock
                                            //     + '\nลดจองจำนวน(Hold)' + newItemUpdateHold
                                            //     + '\n สต๊อกคงเหลือ(Remain)' + newItemUpdateRemain;
                                            const PhisRemark = `(${sel.orderODId}) \nลดสต็อกสินค้า(Stock) ${newItemUpdateStock}
                                            \nลดจองจำนวน(Hold) ${newItemUpdateHold} \nสต๊อกคงเหลือ(Remain) ${newItemUpdateRemain}`;
                                            this.pushHistorysProduct(PhisName, PhisRemark);

                                        }
                                        this.productService.updateProduct(this.product)
                                            .subscribe(() => {
                                                // const textAlert = `อัพเดทสต๊อกสินค้า เรียบร้อยแล้ว
                                                // \nสต๊อกใหม่เป็น ${newItemUpdateStock} Pcs.
                                                // \nจองใหม่เป็น ${newItemUpdateHold} Pcs.`;
                                                // this.alertSuccess(textAlert);
                                                // this.fetchProduct();
                                            });
                                    });
                                // update stock new value //
                            });

                            // checked update product to stock checked //
                            this.order.orderStatusCode = 3;
                            this.order.orderStatusName = 'pack';
                            this.order.orderLastupdate = new Date();
                            const hisName = `ScanToPack`;
                            const hisRemark = `สแกนบาร์โคด(${sel.orderODId})แล้ว (Print => ScanbarCode for Pack)`;
                            this.pushHistorysOrder(hisName, hisRemark);

                            this.orderService.updateOrder(this.order).subscribe((update) => {
                            });
                        } else {
                            // data += 'กรุณาคอนเฟิร์ม order : ' + sel.orderODId + ' ก่อนหน้านี้ก่อนนะครับ คุณข้ามขั้นตอนการทำงาน\n';
                        }
                    }

                });
                this.alertSuccess(`Complete Update (${this.order.orderODId}): \nข้อมูลอัพเดท จำนวน ${dataTrue} ออร์เดอร์`);
                // this.selected = [];
                // this.fetchOrder();
                // this.router.navigate(['management/orders/deliverys']);
            }
        } else {
            // alert('error =');
            let data = '';
            let dataError = 0;
            selected.forEach(sel => {
                if (selected) {
                    this.order = sel;
                    if ((sel.orderStatusCode !== 2) && (sel.orderStatusName !== 'print')) {
                        dataError++;
                        data += 'กรุณาคอนเฟิร์ม order : ' + sel.orderODId + ' ก่อนหน้านี้ก่อนนะครับ คุณข้ามขั้นตอนการทำงาน\n';
                    }
                }
            });
            this.alertErrorSound(`Warning Error (${this.order.orderODId}): \nข้อมูลผิดพลาด จำนวน ${dataError} ออร์เดอร์\n ${data}`);
            // this.selected = [];
            // this.router.navigate(['management/orders/packs']);
        }
    }

    public checkStatusProcess(selected, code, name) {
        if (selected.length > 0) {
            // alert(selected.length + 'code =' + code + 'name =' + name);
            let countTrue = 0;
            let countError = 0;
            selected.forEach(sel => {
                if (selected) {
                    this.order = sel;
                    if ((sel.orderStatusCode === code) && (sel.orderStatusName === name)) {
                        countTrue++;
                    } else {
                        countError++;
                    }
                }
            });

            if (countError > 0) {
                // return alert('error =' + countError + data);
                return false;
            } else {
                // return alert('true =' + countTrue);
                return true;
            }
        }
    }

    async pushHistorysOrder(hisName, hisRemark) {
        // if (this.checkRoleData()) {
        // this.alertSuccess(`คุณมีสิทธื์ใช้งาน เพื่อเข้าถึงข้อมูลนี้ได้`);
        await this.order.historys.push({
            hisName: hisName,
            hisRemark: hisRemark,
            sellerId: this.ID,
            sellerName: this.Name,
            lastUpdate: new Date()
        });
        // } else {
        //     return this.alertWarning(`คุณไม่มีสิทธื์เข้าถึงข้อมูลนี้ กรุณาตรวจสอบอีกครั้ง!`);
        // }
    }

    async pushHistorysProduct(PhisName, PhisRemark) {
        // if (this.checkRoleData()) {
        // this.alertSuccess(`คุณมีสิทธื์ใช้งาน เพื่อเข้าถึงข้อมูลนี้ได้`);
        await this.product.historys.push({
            hisName: PhisName,
            hisRemark: PhisRemark,
            sellerId: this.ID,
            sellerName: this.Name,
            lastUpdate: new Date()
        });
        // } else {
        //     return this.alertWarning(`คุณไม่มีสิทธื์เข้าถึงข้อมูลนี้ กรุณาตรวจสอบอีกครั้ง!`);
        // }
    }

    onSubmitEditOrder(
        channelId, customerId, customerCMId, customerSocial, customerTel, customerNameSurname,
        customerIdhome, address2, zipcode, price, OrderEditForm, method
    ) {
        // alert(channelId);
        // alert(method);
        // alert(JSON.stringify(OrderEditForm.value));
        // const {year, month, day} = OrderEditForm.value.orderPaymentDate;
        // this.paymentDate = new Date(year, month - 1, day);
        // alert(this.paymentDate);
        // alert(price);
        if (this.orderProducts.length === 0) { return; }

        if (method === 'banktranfer') {
            const {year, month, day} = OrderEditForm.value.orderPaymentDate;
            this.paymentDate = new Date(year, month - 1, day);
            // alert(this.paymentDate);
            // alert(OrderEditForm.value.method);
            this.orderPaymentDate = this.paymentDate;
            this.orderPaymentTime = OrderEditForm.value.orderPaymentTime;
            this.orderPaymentImage = this.orderPaymentImageOld;

        }
        if (method === 'cod') {
            // alert('ERROR_ORIGINAL_ERROR');
            this.orderPaymentDate = null;
            this.orderPaymentTime = null;
            this.orderPaymentImage = null;
        }

        // this.submitted = true;
        // if (this.disabled) { return; }
        if (!channelId) { return alert('please selected value : ' + 'ช่องทาง :: orderCustomerChannelId'); }
        // alert(channelId);
        // console.log(channelId);
        const chan = channelId.toString().split(':');
        // console.log('length =' + chan[1].trim().length);
        // console.log('value = ' + chan[1].trim());

        this.saving = true;

        const customer = {
            orderCustomerId:  customerId,
            orderCustomerCMId:  customerCMId,
            orderCustomerChannelId: chan[1].trim(),
            orderCustomerSocial: customerSocial,
            orderCustomerTel: customerTel,
            orderCustomerNameSurname: customerNameSurname,
            orderCustomerIdhome: customerIdhome,
            orderCustomerAddress: address2,
            orderCustomerZipcode: zipcode
        };

        const payment = {
            ...this.paymentForm.value,
            orderPaymentDate: this.orderPaymentDate,
            orderPaymentTime: this.orderPaymentTime,
            orderPaymentImage: this.orderPaymentImage
        };
        const delivery = {
            // ...this.deliveryForm.value,
            price: price,
            orderShipmentId: this.paymentForm.get('orderShipmentId').value
        };

        // if check product for Each stock () //
        // if check product for Each stock () //
        // this.orderProducts.forEach(p => delete p.remain);

        // test function onCompareProductsOrdersEdit for compare products //
        // alert(this.orderForm.value.orderId);
        const orderId = this.orderForm.value.orderId;
        this.onCompareProductsOrdersEditChange(orderId, this.orderProducts);

        const order = {
            ...this.orderForm.value,
            orderCustomerChannelId: chan[1].trim(),
            orderChannelId: chan[1].trim(),
            // orderODId: this.orderODId,
            // orderStatusCode: 0,
            // orderStatusName: 'process',
            customer,
            // products: this.orderProducts,
            products: this.orderProducts,
            delivery,
            // delivery: this.deliveryForm.value,
            payment,
            // orderSellerId: this.ID,
            // orderSellerName: this.Name,
            orderDiscount: this.orderForm.get('discount').value,
            orderTotal: this.orderForm.get('total').value,
            orderLastupdate: new Date(),
            orderCreated: new Date(),
            orderRemark: OrderEditForm.value.orderRemark,
            orderId: this.order.orderId
        };
        // alert(OrderEditForm.value.orderRemark);
        this.submittedOrder.emit(order);
        // console.log(order);
        // return;


        // const diffData = _.differenceBy([{ 'x': 2 }, { 'z': 1 }, { 'y': 1 }], [{ 'x': 2 , 'z': 3 , 'y': 1}], 'x:y:z');
        // const diffDataOrder = _.difference([this.order], [order]);
        // alert(JSON.stringify(this.order));
        // alert(JSON.stringify(order));
        // console.log(_.intersectionWith([this.order], order, _.isEqual));
        // console.log('diffData = ' + JSON.stringify(diffData));
        // console.log('diffDataOrder = ' + JSON.stringify(diffDataOrder));
        // return false;

        const formData = new FormData();
        formData.append('file', this.selectedFile);
        if (this.selectedFile) {
            // alert('thisfile : ' + this.selectedFile + OrderCreateForm.value.orderPaymentImage);
            this.orderService.uploadFile(formData)
                .subscribe(result => {
                    order.payment.orderPaymentImage = result[0].name;
                    this.orderPaymentImage = result[0].name;
                    // add historys //
                    const hisName = 'Update';
                    const hisRemark = 'อัพเดทคำสั่งซื้อ';
                    // this.order = order;
                    this.pushHistorysData(this.order.orderId, hisName, hisRemark);
                    this.orderService.updateOrder(order).subscribe((r: Order) => {
                        const toast = Swal.mixin({
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 3000
                        });
                        toast({
                            type: 'success',
                            title: 'บันทึกข้อมูล เรียบร้อยแล้ว'
                        });
                    });
                    this.orderService.fetchOrder();
                });
        } else {
            // add historys //
            const hisName = 'Update';
            const hisRemark = 'อัพเดทคำสั่งซื้อ';
            this.pushHistorysData(this.order.orderId, hisName, hisRemark);
            this.orderService.updateOrder(order).subscribe((r: Order) => {
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
                toast({
                    type: 'success',
                    title: 'บันทึกข้อมูล เรียบร้อยแล้ว'
                });
            });
            this.orderService.fetchOrder();
        }

        // this.orderService.fetchOrder();
        // this.location.back();
        this.router.navigate(['/management/orders/details']);
    }

    async onCompareProductsOrdersEditChange(orderId, newOrderProducts) {
        if (orderId) {
            await this.orderService.fetchViewOrderId(orderId).subscribe((r: Order) => {
                this.oldOrderProduct = r.products;
                // alert(this.oldOrderProduct.length);
                // alert(newOrderProducts.length);

                if (this.oldOrderProduct.length > newOrderProducts.length) {
                    // alert('> ' + (this.oldOrderProduct.length - newOrderProducts.length));
                    newOrderProducts.forEach(p => {
                        const p_id = p.id;
                        const p_amount = p.amount;
                        // this.oldOrderProduct.filter();
                        const eql = this.oldOrderProduct.filter(re => re.id === p.id);
                        eql.forEach(m => {
                            console.log('old > new');
                            const m_amount = m.amount;
                            if (p_amount === m_amount) {
                                // next pass //
                                console.log('old > new  ===');
                                console.log(p.id + ' = ' + (p_amount + '( - )' + m_amount));
                                console.log('old > new  ===');
                                // next pass //
                            }
                            if (p_amount > m_amount) {
                                console.log('old > new  >>');
                                console.log(p.id + ' > ' + (m_amount + '( - )' + p_amount));
                                console.log('old > new  >>');
                            }
                            if (p_amount < m_amount) {
                                console.log('old > new  <<');
                                console.log(p.id + ' < ' + (m_amount + '( - )' + p_amount));
                                console.log('old > new  <<');
                            }
                        });
                    });
                    // old > //
                    if ((this.oldOrderProduct.length - newOrderProducts.length) > 0) {
                        newOrderProducts.forEach(p => {
                            const p_id = p.id;
                            const p_amount = p.amount;
                            const old_eql = this.oldOrderProduct.filter(re => re.id !== p.id);
                            if (old_eql.length > 0) {
                                old_eql.forEach(re => {
                                    console.log('new !== old  >>');
                                    // alert('old_eql.length = ' + old_eql.length + 're.id = ' + re.id + 're.amount : ' + re.amount);
                                    // alert(JSON.stringify(old_eql));
                                    // console.log('old_eql.length = ' + old_eql.length + 're.id : ' + re.id + 're.amount : ' + re.amount);
                                    if (p_amount === re.amount) {
                                        // next pass //
                                        console.log('new !== old  ===');
                                        console.log('old_eql.length === ' + old_eql.length + 're.id : ' + re.id + 're.amount : ' + re.amount);
                                        console.log(re.id + ' = ' + (' p_amount : ' + p_amount + '( - )' + ' re.amount : ' + re.amount));
                                        console.log('new !== old  ===');
                                        // next pass //
                                    }
                                    if (p_amount > re.amount) {
                                        console.log('new !== old  >>');
                                        console.log('old_eql.length >> ' + old_eql.length + 're.id : ' + re.id + 're.amount : ' + re.amount);
                                        console.log(re.id + ' > ' + (' re.amount : ' + re.amount + '( - )' + ' p_amount : ' + p_amount));
                                        console.log('new !== old  >>');
                                    }
                                    if (p_amount < re.amount) {
                                        console.log('new !== old  <<');
                                        console.log('old_eql.length << ' + old_eql.length + 're.id : ' + re.id + 're.amount : ' + re.amount);
                                        console.log(re.id + ' < ' + (' re.amount : ' + re.amount + '( - )' + ' p_amount : ' + p_amount));
                                        console.log('new !== old  <<');
                                    }
                                });
                            }
                        });
                    }
                } else if (this.oldOrderProduct.length === newOrderProducts.length) {
                    // alert('= ' + (newOrderProducts.length - this.oldOrderProduct.length));
                    newOrderProducts.forEach(p => {
                        const p_id = p.id;
                        const p_amount = p.amount;
                        const eql = this.oldOrderProduct.filter(re => re.id === p.id);

                        eql.forEach(m => {
                            const m_amount = m.amount;
                            if (p_amount === m_amount) {
                                // next pass //
                                // console.log('=====');
                                // console.log('= eql.length === ' + eql.length + 'm.id : ' + m.id + 'm.amount : ' + m.amount);
                                // console.log(p.id + ' = ' + ('p_amount : ' + p_amount + '( - )' + 'm_amount : ' + m_amount));
                                // console.log('=====');
                                // next pass //
                            }
                            if (p_amount > m_amount) {
                                console.log('>>>');
                                console.log('= eql.length >> ' + eql.length + 'm.id : ' + m.id + 'm.amount : ' + m.amount);
                                console.log(p.id + ' >> ' + ('m_amount : ' + m_amount + '( - )' + 'p_amount : ' + p_amount));
                                console.log('>>>');

                            }
                            if (p_amount < m_amount) {
                                console.log('<<<');
                                console.log('= eql.length << ' + eql.length + 'm.id : ' + m.id + 'm.amount : ' + m.amount);
                                console.log(p.id + ' << ' + ('m_amount : ' + m_amount + '( - )' + 'p_amount = ' + p_amount));
                                console.log('<<<');
                            }
                            // const not_eql = this.oldOrderProduct.filter(re => p.id !== re.id);
                            // not_eql.forEach(me => {
                            //     const me_amount = me.amount;
                            //     console.log('new_id : ' + me.id + ', amount " ' + me.amount);
                            // });

                        });

                    });
                } else if (this.oldOrderProduct.length < newOrderProducts.length) {
                    console.log('< ' + (newOrderProducts.length - this.oldOrderProduct.length));
                    newOrderProducts.forEach(p => {
                        const p_id = p.id;
                        const p_amount = p.amount;
                        const eql = this.oldOrderProduct.filter(re => re.id === p.id);
                        eql.forEach(m => {
                            const m_amount = m.amount;
                            if (p_amount === m_amount) {
                                // next pass //
                                console.log('===');
                                console.log('< eql.length === ' + eql.length + 'm.id : ' + m.id + 'm.amount : ' + m.amount);
                                console.log(p.id + ' = ' + ('p_amount : ' + p_amount + '( - )' + 'm_amount : ' + m_amount));
                                console.log('===');
                                // next pass //
                            }
                            if (p_amount > m_amount) {
                                console.log('>>');
                                console.log('< eql.length >> ' + eql.length + 'm.id : ' + m.id + 'm.amount : ' + m.amount);
                                console.log(p.id + ' > ' + ('m_amount : ' + m_amount + '( - )' + 'p_amount : ' + p_amount));
                                console.log('>>');
                            }
                            if (p_amount < m_amount) {
                                console.log('<<');
                                console.log('< eql.length << ' + eql.length + 'm.id : ' + m.id + 'm.amount : ' + m.amount);
                                console.log(p.id + ' < ' + ('m_amount : ' + m_amount + '( - )' + 'p_amount : ' + p_amount));
                                console.log('<<');
                            }
                        });
                    });
                    // new > //
                    if ((newOrderProducts.length - this.oldOrderProduct.length) > 0) {
                        this.oldOrderProduct.forEach(me => {
                            const o_id = me.id;
                            const o_amount = me.amount;
                            const new_eql = newOrderProducts.filter(re => re.id !== me.id);
                            if (new_eql.length > 0) {
                                new_eql.forEach(re => {
                                    // alert('new_eql.length = ' + new_eql.length );
                                    // alert(JSON.stringify(new_eql));
                                    // alert('re.id = ' + re.id);
                                    // alert('re.amount : ' + re.amount);
                                    // console.log('< ' + (newOrderProducts.length - this.oldOrderProduct.length));
                                    // console.log('new_eql.length : ' + new_eql.length + ',\nre.id : ' + re.id + ',\nre.amount : ' + re.amount);
                                    if (o_amount === re.amount) {
                                        // next pass //
                                        console.log('new === new');
                                        console.log('< new_eql.length === ' + new_eql.length + ',\nre.id : ' + re.id + ',\nre.amount : ' + re.amount);
                                        console.log(re.id + ' = ' + (' o_amount : ' + o_amount + '( - )' + ' re.amount : ' + re.amount));
                                        console.log('new === new');
                                        // next pass //
                                    }
                                    if (o_amount > re.amount) {
                                        console.log('new >> new');
                                        console.log('< new_eql.length >> ' + new_eql.length + ',\nre.id : ' + re.id + ',\nre.amount : ' + re.amount);
                                        console.log(re.id + ' > ' + (' re.amount : ' + re.amount + '( - )' + ' o_amount : ' + o_amount));
                                        console.log('new >> new');
                                    }
                                    if (o_amount < re.amount) {
                                        console.log('new << new');
                                        console.log('< new_eql.length << ' + new_eql.length + ',\nre.id : ' + re.id + ',\nre.amount : ' + re.amount);
                                        console.log(re.id + ' < ' + (' re.amount : ' + re.amount + '( - )' + ' o_amount : ' + o_amount));
                                        console.log('new << new');
                                    }
                                });
                            }
                            // alert(JSON.stringify(new_eql));
                        });
                    }
                }

                // r.products.forEach((p) => {
                //     const old_orderProducts = p;


                // console.log('old_orderProducts = ' + JSON.stringify(old_orderProducts));
                // console.log('dataP = ' + `${p.id} , ${p.name} , ${p.code} ${p.amount}`);
                // this.productService.hold(p.id, p.amount)
                //     .subscribe((res: Product) => {
                //         // console.log(res);
                //         this.product = res;
                //         this.product.productId = res.productId;
                //         this.product.productTotal = res.productTotal;
                //         this.product.productHold = res.productHold;
                //         const newHold = (res.productHold - p.amount);
                //         this.product.productRemain = (res.productTotal - res.productHold);
                //         // alert(`${res.productId} , newHold =  ${newHold}`);
                //         // console.log(`Remain Data ${res.productId} = (${res.productTotal}-${res.productHold}) => ${res.productTotal - res.productHold}`);
                //         // return;
                //         this.productService.updateHold(res.productId, newHold)
                //             .subscribe();
                //     });
                // });
            });
        }
    }

    public pushHistorysData(id, hisName, hisRemark) {
        // if (this.checkRoleData()) {
        // this.alertSuccess(`คุณมีสิทธื์ใช้งาน เพื่อเข้าถึงข้อมูลนี้ได้`);

        this.orderService.fetchViewOrderId(id).subscribe((r: Order) => {
            this.order = r;
            this.order.historys.push({
                hisName: hisName,
                hisRemark: hisRemark,
                sellerId: this.ID,
                sellerName: this.Name,
                lastUpdate: new Date()
            });

            this.orderService.updateOrder(this.order).subscribe((m: Order) => {
                return true;
                // const toast = Swal.mixin({
                //     toast: true,
                //     position: 'top-end',
                //     showConfirmButton: false,
                //     timer: 3000
                // });
                // toast({
                //     type: 'success',
                //     title: 'บันทึกข้อมูล เรียบร้อยแล้ว'
                // });
            });
        });
        // } else {
        //     return this.alertWarning(`คุณไม่มีสิทธื์เข้าถึงข้อมูลนี้ กรุณาตรวจสอบอีกครั้ง!`);
        // }
    }

    fetchCustomer() {
        this.sub = this.customerService.fetchCustomer()
        // .map((m: Customer[]) => {
        //     let x = 0;
        //     m.map(r => {
        //         r.index = ++x;
        //         // if (r.customerImage) {
        //         //     r.customerImage = `${env.serverAPI}/images/customer/` + r.customerImage;
        //         // } else {
        //         //     r.customerImage = `${env.serverAPI}/images/image-blank.jpg`;
        //         // }
        //
        //         if (r.customerLastupdate) {
        //             const dd = r.customerLastupdate.toString().split('T');
        //             const ddConv = dd[0].split('-');
        //             r.customerLastupdate = ddConv[2]  + '-' + ddConv[1] + '-' + ddConv[0];
        //         }
        //         return r;
        //     });
        //     return m;
        // })
        // .subscribe((r: Customer[]) => this.customers = r);
            .subscribe((r: Customer[]) => {
                // console.log(r);
                this.customers = r;
            });
    }

    fetchChannel() {
        this.sub = this.channelService.fetchChannel()
            .map((m: Channel[]) => {
                let x = 0;
                m.map(r => {
                    r.index = ++x;
                    if (r.channelImage) {
                        r.channelImage = `${env.serverAPI}/images/channel/` + r.channelImage;
                    } else {
                        r.channelImage = `${env.serverAPI}/images/image-blank.jpg`;
                    }

                    if (r.channelLastupdate) {
                        const dd = r.channelLastupdate.toString().split('T');
                        const ddConv = dd[0].split('-');
                        r.channelLastupdate = ddConv[2] + '-' + ddConv[1] + '-' + ddConv[0];
                    }
                    return r;
                });
                return m;
            })
            // .subscribe((r: Channel[]) => this.channels = r);
            .subscribe((r: Channel[]) => {
                // console.log(r);
                this.channels = r;
                // this.customerForm.patchValue({orderCustomerChannelId: r[0].channelId});
            });
    }

    // fetchViewProduct(pid) {
    //   this.dataSub = this.productService.fetchViewProductId(pid)
    //       .subscribe(r => {
    //          this.dataProducts = r;
    //       });
    // }

    fetchShipment() {
        this.sub = this.shipmentService.fetchShipment()
            .map((m: Shipment[]) => {
                let x = 0;
                m.map(r => {
                    r.index = ++x;
                    if (r.shipmentImage) {
                        r.shipmentImage = `${env.serverAPI}/images/shipment/` + r.shipmentImage;
                    } else {
                        r.shipmentImage = `${env.serverAPI}/images/image-blank.jpg`;
                    }

                    if (r.shipmentStartDate) {
                        const dd = r.shipmentStartDate.toString().split('T');
                        const ddConv = dd[0].split('-');
                        r.shipmentStartDate = ddConv[2] + '-' + ddConv[1] + '-' + ddConv[0];
                    }
                    return r;
                });
                return m;
            })
            // .subscribe((r: Shipment[]) => this.shipments = r);
            .subscribe((r: Shipment[]) => {
                // console.log(r);
                this.shipments = r;
                // this.paymentForm.patchValue({ orderShipmentId: r[0].shipmentId });
            });
    }

    fetchBank() {
        this.sub = this.bankService.fetchBank()
            .map((m: Bank[]) => {
                let x = 0;
                m.map(r => {
                    r.index = ++x;
                    if (r.bankImage) {
                        r.bankImage = `${env.serverAPI}/images/bank/` + r.bankImage;
                    } else {
                        r.bankImage = `${env.serverAPI}/images/image-blank.jpg`;
                    }

                    if (r.bankStartDate) {
                        const dd = r.bankStartDate.toString().split('T');
                        const ddConv = dd[0].split('-');
                        r.bankStartDate = ddConv[2] + '-' + ddConv[1] + '-' + ddConv[0];
                    }
                    return r;
                });
                return m;
            })
            // .subscribe((r: Bank[]) => this.banks = r);
            .subscribe((r: Bank[]) => {
                // console.log(r);
                this.banks = r;
                // this.paymentForm.patchValue({orderBankId: r[0].bankId});
            });
    }

    isInvalid(form: FormGroup, attr: string): boolean {
        const value = form.get(attr);
        return value.invalid && (value.dirty || value.touched);
        // console.log(value);
    }

    private setOnchangePaymentMethod() {
        this.paymentForm.get('method').valueChanges
            .subscribe(method => {
                // if (method === 'banktranfer') {
                //     this.paymentForm.get('orderBankId').setValidators([Validators.required]);
                //     // this.setPaymentDateTime();
                //     this.paymentForm.patchValue({
                //         orderBankId: this.banks[0].bankId
                //     });
                // } else {
                //     this.paymentForm.get('orderBankId').setValidators(null);
                //     // this.paymentForm.patchValue({ orderBankId: null, date: null, time: null });
                //     this.paymentForm.patchValue({ orderBankId: null});
                // }
                if (method === 'cod') {
                    this.paymentForm.get('orderBankId').setValidators(null);
                    // this.paymentForm.patchValue({ orderBankId: null, date: null, time: null });
                    this.paymentForm.patchValue({ orderBankId: null});
                    this.paymentForm.patchValue({ orderPaymentDate: null});
                    this.paymentForm.patchValue({ orderPaymentTime: null});
                    this.paymentForm.patchValue({ orderPaymentImage: null});
                }
                if (method === 'banktranfer') {
                    this.paymentForm.get('orderBankId').setValidators([Validators.required]);
                    if (this.orderBankId === null) {
                        this.bankService.fetchBank()
                            .subscribe(m => {
                                this.orderBankIdDefualt = m[0].bankId;
                                // alert(this.orderBankIdDefualt);
                                // console.log(this.orderBankIdDefualt);
                            });
                        // this.paymentForm.patchValue({orderBankId: this.orderBankIdDefualt});
                    } else {
                        this.paymentForm.get('orderBankId').setValidators([Validators.required]);
                        this.paymentForm.patchValue({
                            orderBankId: this.orderBankId
                        });
                    }
                }

            });
    }

    findProduct(value) {
        // const enum Key {
        //     Backspace = 8,
        //     Tab = 9,
        //     Enter = 13,
        //     Shift = 16,
        //     Ctrl = 17,
        //     Alt = 18,
        //     PauseBreak = 19,
        //     CapsLock = 20,
        //     Escape = 27,
        //     Space = 32,
        //     PageUp = 33,
        //     PageDown = 34,
        //     End = 35,
        //     Home = 36,
        //
        //     LeftArrow = 37,
        //     UpArrow = 38,
        //     RightArrow = 39,
        //     DownArrow = 40
        // }
        if ((value.length < 1) || (value === ' ')) {
            (<HTMLInputElement>document.getElementById('searchProductInput')).value = '';
            this.clearSearchProducts();
            return this.clearSearchProducts();
        }

        this.productService.findByName(value)
            .map((m: Product[]) => {
                let x = 0;
                m.map(r => {
                    r.index = ++x;
                    if (r.productImage) {
                        r.productImage = `${env.serverAPI}/images/product/` + r.productImage;
                    } else {
                        r.productImage = `${env.serverAPI}/images/image-blank.jpg`;
                    }
                    return r;
                });
                return m;
            })
            .subscribe(resp => {
                this.products = resp;
                // console.log(this.products);
                this.searchProducts = resp.slice(0, 20);
                // this.searchProducts = this.products.slice(0, 10);
                // console.log(this.searchProducts);
            });
    }

    addProduct(product, size = null) {
        // addProduct(product) {
        // alert(JSON.stringify(product));
        // alert(product.productTotal);
        // alert(product.productCodename);
        // alert(product.productPiece);
        // alert(product.productInventory);
        const remain = (product.productTotal - product.productHold);
        // if (product.productTotal === 0 || (size && size.productTotal === 0)) { return; }
        // if (product.productTotal === 0 || (product.productRemain === 0)) { return; }
        if (product.productTotal === 0) { return; }
        if (remain <= 0 || (size && size.productTotal === 0)) {
            // alert('สินค้าหมดสต๊อกแล้วครับ...');
            const toast = Swal.mixin({
                toast: true,
                position: 'top',
                showConfirmButton: false,
                timer: 5000
            });
            toast({
                type: 'warning',
                title: 'สินค้าหมดสต๊อกแล้วครับ...'
            });

            (<HTMLInputElement>document.getElementById('searchProductInput')).value = '';
            this.clearSearchProducts();
            return;
        }

        // console.log(JSON.stringify(product) + ' -- ' + size);
        // console.log(product.productTotal + ' -- ' + size);
        let pid = product.productId;
        // alert(pid + ' XX' + product.productRemain);
        let code = product.productCodename;
        let name = product.productName;
        let max = (product.productTotal - product.productHold);
        // let total = product.productTotal;
        // let inventory = product.productInventory;
        // let id = product.productId;
        // alert(code + name + total + inventory);
        // if (size) {
        //     code = size.code;
        //     name = `${product.name}-${size.name}`;   // -- ลบค่า -- ฝฝ
        // }
        // alert(size);
        // alert(name);
        // alert(id);

        // const notExistInOrderProduct = !this.orderProducts
        // const notExistInOrderProduct = !this.order.products
        //     .find(p => p.code === code);
        const notExistInOrderProduct = !this.orderProducts
            .find(p => p.id === pid);
        // alert(notExistInOrderProduct);

        if (notExistInOrderProduct) {

            // if (product.productImage) {
            //     this.imageUrlProduct = `${env.serverAPI}/images/product/` + product.productImage;
            // } else {
            //     this.imageUrlProduct = `${env.serverAPI}/images/image-blank.jpg`;
            // }
            // alert(this.imageUrlProduct);
            // this.orderProducts.push({
            // this.order.products.push({
            //     id: product.productId,
            //     code: code,
            //     name: name,
            //     price: product.productPiece,
            //     amount: 1,
            //     max: product.productRemain,
            //     remain: product.productTotal,
            //     // total: product.productPiece,
            //     total: product.productPiece,
            //     image: product.productImage
            // });
            this.orderProducts.push({
                id: product.productId,
                code: code,
                name: name,
                price: product.productPiece,
                amount: 1,
                max: max,
                // max: product.productTotal - product.productHold,
                remain: size ? size.productTotal : (product.productTotal - product.productHold),
                // total: product.productPiece,
                total: product.productPiece,
                image: product.productImage
            });
        }

        (<HTMLInputElement>document.getElementById('searchProductInput')).value = '';
        this.clearSearchProducts();
        this.calTotalOrder();
    }

    // checkproduct amount for remain stock //
    onChangeProductAmountCheck(product) {
        // alert(JSON.stringify(product));
        this.sub = this.productService.fetchViewProductId(product.id)
            .subscribe((r: Product) => {
                this.product = r;
                const remain = ((r.productTotal - r.productHold));
                this.product.productRemain = (r.productTotal - r.productHold);
                // console.log(this.product.productRemain);
                // console.log('True = ' + (r.productTotal - r.productHold));
                // console.log('True - 1 = ' + remain);

                if (product.amount < 1) { product.amount = 1; }
                if (r.productRemain !== remain) {
                    alert('ข้อมูลสินค้าในสต็อกไม่ตรงกัน ??? กรุณาตรวจสอบ\n' +
                        '\nStock-Remain = ' + r.productRemain +
                        '\nStock-Hold = ' + r.productHold +
                        '\nStock-Total = ' + r.productTotal
                    );
                }
                if (product.amount > remain) {
                    product.amount = remain;
                }
            });
    }

    onChangeProductAmount(product) {
        // check stock remain to database in products //
        // alert(pid);
        // (<HTMLInputElement>document.getElementById('max')).value = '';

        // this.productService.fetchViewProductId(pid)
        //     .subscribe((r: Product) => {
        //         this.product.productId = r.productId;
        //         this.product.productTotal = r.productTotal;
        //         this.product.productHold = r.productHold;
        //         this.product.productRemain = (r.productTotal - r.productHold);
        //     })
        // if ((pid === this.product.productId) || (product.amount > this.product.productRemain)) { alert(this.product.productRemain); }
        // check stock remain to database in products //

        if (product.amount < 1) { product.amount = 1; }
        // if ((pid === this.product.productId) && (product.amount > this.product.productRemain)) {
        //     (<HTMLInputElement>document.getElementById('max_' + pid)).value = this.product.productRemain;
        //     // product.amount = (this.product.productTotal - this.product.productHold);
        //     // product.amount = this.product.productRemain;
        // }
        // if (product.amount > this.product.productRemain) { product.amount = this.product.productRemain; }
        if (product.amount > product.productTotal - product.productHold) {
            product.amount = product.productTotal - product.productHold;

        }
        product.total = product.amount * product.price;
        this.calTotalOrder();
    }

    calTotalOrder() {
        const productTotalPrice = +this.orderProducts.reduce(
            (sum, product) => sum + product.total, 0
        );
        // alert(productTotalPrice);
        const deliveryPrice = +this.deliveryForm.get('price').value;
        const discount = +this.orderForm.get('discount').value;
        // const total = productTotalPrice + (deliveryPrice - discount);
        const total = (productTotalPrice + (deliveryPrice - discount));
        this.orderForm.patchValue({ total });
        // alert(deliveryPrice);
        // alert(discount);
        // alert(total);
    }

    removeProduct(product) {
        // this.orderProducts = this.orderProducts.filter(p => p.code !== product.code);
        console.log(product.id);
        console.log(product.amount);
        console.log(product.name);
        this.orderProducts = this.orderProducts.filter(p => p.id !== product.id);

        console.log(this.orderProducts);
        this.calTotalOrder();
    }

    private clearSearchProducts() {
        this.searchProducts = [];
    }

    private setJqueryThailand() {
        $.Thailand({
            database: `${env.serverAPI}/libs/jquery.Thailand.db.json`,
            // database: `${env.serverAPI}/images/jquery.Thailand.db.json`,
            // database: `lib/jquery.Thailand.db.json`,
            $search: $('#address2'),
            autocomplete_size: 20,
            onDataFill: (data) => {
                this.customerForm.patchValue({
                    // this.customerForm.setValue({
                    address2: `ต.${data.district} อ.${data.amphoe} จ.${data.province}`,
                    zipcode: data.zipcode
                });
            }
        });
    }

    handleFileInputAdd(file: FileList) {
        const formData = new FormData();
        formData.append('file', file.item(0));
        this.selectedFile = file.item(0);
        this.fileToUpload = file.item(0);

        const reader = new FileReader();
        if (this.fileToUpload) {
            reader.onload = (event: any) => {
                this.imageUrl = event.target.result;
            };
            reader.readAsDataURL(this.fileToUpload);
        } else {
            // ไม่เลือกรูปภาพ  ให้โชว์ภาพว่างๆ
            this.imageUrl = this.imageUrlBlank;
        }
    }

    handleFileInputEdit(file: FileList) {
        const formData = new FormData();
        formData.append('file', file.item(0));
        this.selectedFile = file.item(0);

        this.fileToUpload = file.item(0);

        const reader = new FileReader();
        if (this.fileToUpload) {
            reader.onload = (event: any) => {
                // this.imageUrl = event.target.result;
                this.orderPaymentImage = event.target.result;
                this.showImg = event.target.result;
            };
            reader.readAsDataURL(this.fileToUpload);
        } else {
            // ไม่เลือกรูปภาพ  ให้โชว์ภาพว่างๆ
            this.showImg = this.orderCache;
            this.orderPaymentImage = this.orderCache;
        }
    }

    resetFile(state?: string) {
        this.imageUrl = state === 'add' ? this.imageUrlBlank : '';
        this.resetFileDefault = '';
    }

    checkTime(value) {
        if (value < 10) {
            value = '0' + value;
        }
        return value;
    }

    // Destroy data unsubscript //
    ngOnDestroy() {
        if (this.dataSub !== null) {
            this.dataSub.unsubscribe();
        }
        if (this.sub !== null) {
            this.sub.unsubscribe();
        }
    }

    // function checkRole && alertData //
    public alertWarning(val: string) {
        const toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 5000
        });
        toast({
            type: 'warning',
            title: val
        });
    }

    public alertSuccess(val: string) {
        const toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 5000
        });
        toast({
            type: 'success',
            title: val
        });
    }

    public alertErrorSound(val: string) {
        const toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 5000
        });
        toast({
            type: 'warning',
            html: `<audio autoplay>
                <source src="assets/sound/error.ogg" type="audio/ogg">
                <source src="assets/sound/error.wav" type="audio/wav">
                <source src="assets/sound/error.mp3" type="audio/mp3">
                </audio>`,
            title: val
        });
    }

    public alertSuccessSound(val: string) {
        const toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 5000
        });
        toast({
            type: 'success',
            html: `<audio autoplay>
                    <source src="assets/sound/success.ogg" type="audio/ogg">
                    <source src="assets/sound/success.wav" type="audio/wav">
                    <source src="assets/sound/success.mp3" type="audio/mp3">
                    </audio>`,
            title: val
        });
    }
    public alertSuccessWaitSound(val: string) {
        const toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 7000
        });
        toast({
            type: 'success',
            html: `<audio autoplay>
                   <source src="assets/sound/militarytrumpet.ogg" type="audio/ogg">
                   <source src="assets/sound/militarytrumpet.wav" type="audio/wav">
                   <source src="assets/sound/militarytrumpet.mp3" type="audio/mp3">
                   </audio>`,
            title: val
        });
    }

}
