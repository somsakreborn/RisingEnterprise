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
declare var ClipboardJS: any;

import Swal from 'sweetalert2';

import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-orders-product-edit',
    templateUrl: './orders-product-edit.component.html',
    styleUrls: [
        './orders-product-edit.component.scss',
        '../../../../assets/icon/icofont/css/icofont.scss',
        '../../../../../node_modules/famfamfam-flags/dist/sprite/famfamfam-flags.min.css'
    ]
})
export class OrdersProductEditComponent implements OnInit, OnDestroy {
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

    // public maskUsPrice = [/[0-9]/, /[0-9]/, /[0-9]/, /\d/];

    // address2: string;
    // zipcode: any;
    // customerForm: FormGroup;
    searchProducts: any;
    // OrderForm: FormGroup;
    // submitted: boolean;
    submitted = false;
    isReadOnly = false;
    checkDisable: boolean;

    selectedValue: string;
    selectedOption: any;

    mID: any;
    isCollapsed = true;
    isDetailsCollapsed = true;
    message: string;

    // public model: any;
    public model2: any;
    public modelCustomers: any;
    public modelProvince: any;

    private sub: Subscription = null;
    private dataSub: Subscription = null;
    ENVserverAPI = env.serverAPI;
    ENVserverCustomrerLink = env.serverCustomerLink;
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
    orderBankId: number;
    orderBankIdDefualt: number;
    orderMethod: string;
    orderPaymentDate: any;
    orderPaymentTime: any;
    orderPaymentImage: any;
    orderPaymentImageOld: any;
    orderHistorysLength: any;
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
    modelPopupOrderCreated: NgbTimeStruct;

    modelTime: NgbTimeStruct = {} as NgbTimeStruct;

    public date: { year: number, month: number, day: number };
    // public time: { hour: number, minute: number};

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
    str1 = "https://178.128.117.155:8888/images/product/jsdz8cpz5hegkhwcjsdz8cq0.JPG";

    searchCustomer = (text$: Observable<string>) =>
        // text$.pipe(
        //     debounceTime(200),
        //     distinctUntilChanged(),
        //     // map(term => term.length < 1 ? []
        //     map(term => term.length < 1 ? []
        //         : this.customers
        //             .filter(v => v.customerTel.indexOf(term.toLowerCase()) > -1).slice(0, 20))
        // )
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map(term => term.length < 1 ? []
                : this.customers
                // .filter(v => v.customerTel.indexOf(term.toLowerCase()) > -1).slice(0, 20))
                    .filter(v => {
                        return (v.customerTel.toLowerCase().indexOf(term) !== -1 || !term ||
                            v.customerNameSurname.toLowerCase().indexOf(term) !== -1 || !term
                        );
                    })
            )
        )

    formatterCustomer = (x: {customerNameSurname: string}) => x.customerNameSurname;
    formatterCustomerNameSurname = (x: {customerNameSurname: string}) => x.customerNameSurname;
    formatterCustomerId = (x: {customerId: number}) => x.customerId;
    formatterCustomerCMId = (x: {customerCMId: string}) => x.customerCMId;

    searchSocial = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map(term => term.length < 1 ? []
                :  this.customers.filter(v => v.customerSocial.indexOf(term) > -1).slice(0, 15))
        )

    formatterSocial = (x: {customerSocial: string}) => x.customerSocial;

    searchTel = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map(term => term.length < 1 ? []
                :  this.customers.filter(v => v.customerTel.indexOf(term) > -1).slice(0, 15))
        )

    formatterTel = (x: {customerTel: string}) => x.customerTel;
    // formatterCustomer = (x: {customerNameSurname: string}) => x.customerNameSurname;
    // formatterCustomerId = (x: {customerId: number}) => x.customerId;
    // formatterSocial = (x: {customerSocial: string}) => x.customerSocial;
    // formatterCustomerNameSurname = (x: {customerNameSurname: string}) => x.customerNameSurname;
    // formatterCustomerTel = (x: {customerTel: string}) => x.customerTel;
    // formatterCustomerSocial = (x: {customerSocial: string}) => x.customerSocial;
    // formatterCustomerAddress = (x: {customerAddress: string}) => x.customerAddress;
    // formatterCustomerZipcode = (x: {customerZipcode: string}) => x.customerZipcode;

    collapsed(): void {
        this.message = 'Show';
    }

    expanded(): void {
        this.message = 'Hide';
    }

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
        // add script //
        this.route.params.subscribe(params => {
            // console.log(params);
            // alert(params['keyword']);
            this.mID = params['keyword'];
            this.fetchOrderKeyword(this.mID);
            new ClipboardJS('#btnCopy');
        });
        // add script //

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

      // var str = "Apples are round, and apples are juicy.";
      // const str1 = 'http://178.128.117.155:8888/images/product/jsdz8cpz5hegkhwcjsdz8cq0.JPG';
      // const sliced = str1.slice(-20, -19);
      console.log(this.str1.slice(20, -19));
    }

    ngOnInit() {
        // this.fetchViewOrderODId(this.mID);

        this.ID = JSON.parse(localStorage.getItem('ID'));
        this.Name = JSON.parse(localStorage.getItem('Name'));
        this.checkRole = JSON.parse(localStorage.getItem('Role'));

        // alert(this.mID);
        // console.log(this.dataOrder);
        // test RXJS data //
        // range(1, 100)
        //     .pipe(filter(x => x % 3 === 1), map(x => x + x))
        //     .subscribe(x => console.log(x));
        // end test RXJS data //


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
                // Validators.minLength(10),
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
            orderDiscount: [0],
            discount: [0],
            total: [0]
        });

        this.fetchCustomer();
        this.fetchShipment();
        this.fetchChannel();
        this.fetchBank();
        // this.fetchOrderODId();
        this.setOnchangePaymentMethod();
        //   this.ID = JSON.parse(localStorage.getItem('ID'));
        //   this.Name = JSON.parse(localStorage.getItem('Name'));
        // this.checkRole = JSON.parse(localStorage.getItem('Role'));

        this.setJqueryThailand();
        // console.log(this.setJqueryThailand());
        // console.log(JSON.stringify(this.customers.filter(x => x.customerId)));
    }

    fetchOrderKeyword (mID) {
        // alert('mID = ' + mID);
        this.mID = mID;
        // alert('this.mID = ' + this.mID);
        this.sub = this.orderService.fetchViewOrderODId(this.mID)
            .map((m: Order) => {
                // m.orderLastupdate = new Date(m[0].payment.orderPaymentDate);
                // m.orderCreated = new Date(m.orderCreated);
                const ddStart = new Date(m[0].payment.orderPaymentDate);
                this.modelPopupOrderLastupdate = {year: ddStart.getFullYear(), month: ddStart.getMonth() + 1, day: ddStart.getDate()};
                // const ddCreate = new Date(m.orderCreated);
                // this.modelPopupOrderCreated = {year: ddCreate.getFullYear(), month: ddCreate.getMonth() + 1, day: ddCreate.getDate()};
                // console.log(m.orderLastupdate);
                // console.log('dd : ' + ddStart);
                if (m[0].products.length > 0) {
                    m[0].products.forEach((pp: Products) => {

                        this.productService.fetchViewProductCodename(pp.code)
                            .map((mm) => {
                                if (mm.productCodename === pp.code) {
                                    pp.max = (mm.productTotal - mm.productHold);
                                    pp.remain = (mm.productTotal - mm.productHold);
                                    pp.checkamount = 0;
                                }
                                if (mm.productImage) {
                                   // pp.image = mm.productImage;
                                   pp.image = `${env.serverAPI}/images/product/` + mm.productImage;
                                } else {
                                  // pp.image = `image-blank.jpg`;
                                  pp.image = `${env.serverAPI}/images/image-blank.jpg`;
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
            .subscribe(r => {
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
                this.order.orderChannelId = r[0].orderChannelId;
                this.order.customer = r[0].customer;
                this.order.delivery = r[0].delivery;
                this.order.orderTracking = r[0].orderTracking;
                this.order.delivery.orderTracking = r[0].delivery.orderTracking;
                this.order.orderDiscount = r[0].orderDiscount;
                this.order.orderTotal = r[0].orderTotal;
                this.order.customer = r[0].customer;
                this.order.orderRemark = r[0].orderRemark;
                this.order.historys = r[0].historys.reverse();
                this.orderHistorysLength = r[0].historys.length;
                // alert(this.orderPaymentTime);
                // console.log(this.orderMethod);
                // console.log(this.orderProducts);
                // console.log(r[0].payment.orderPaymentDate);
                // (<HTMLInputElement>document.getElementById('discount')).value = r[0].orderDiscount;

                (<HTMLInputElement>document.getElementById('orderCustomerId')).value = r[0].customer.orderCustomerId;
                (<HTMLInputElement>document.getElementById('orderCustomerCMId')).value = r[0].customer.orderCustomerCMId;
                (<HTMLInputElement>document.getElementById('orderCustomerTel')).value = r[0].customer.orderCustomerTel;
                (<HTMLInputElement>document.getElementById('orderCustomerSocial')).value = r[0].customer.orderCustomerSocial;
                (<HTMLInputElement>document.getElementById('orderCustomerNameSurname')).value = r[0].customer.orderCustomerNameSurname;
                (<HTMLInputElement>document.getElementById('orderCustomerIdhome')).value = r[0].customer.orderCustomerIdhome;
                (<HTMLInputElement>document.getElementById('address2')).value = r[0].customer.orderCustomerAddress;
                (<HTMLInputElement>document.getElementById('zipcode')).value = r[0].customer.orderCustomerZipcode;

                if (this.orderPaymentDate) {
                    // alert('"NotNull : ' + this.orderPaymentDate);
                } else {
                    // alert('IsNull : ' + this.orderPaymentDate);
                    const ddStart = new Date();
                    this.modelPopupOrderLastupdate = {year: ddStart.getFullYear(), month: ddStart.getMonth() + 1, day: ddStart.getDate()};
                    // alert('IsSet : ' + this.modelPopupOrderLastupdate);
                }

                if (this.orderPaymentImage) {
                    this.orderPaymentImage = `${env.serverAPI}/images/payment/` + r[0].payment.orderPaymentImage;
                    // console.log('True : ' + this.orderPaymentImage);
                    this.showImg = this.orderPaymentImage;
                    this.orderCache = this.orderPaymentImage;
                } else {
                    this.orderPaymentImage = `${env.serverAPI}/images/image-blank.jpg`;
                    // console.log('False : ' + this.orderPaymentImage);
                    this.showImg = this.orderPaymentImage;
                    this.orderCache = this.orderPaymentImage;
                }

                if ((this.orderPrice !== null)) {
                    // console.log(this.orderPrice);
                    // (<HTMLInputElement>document.getElementById('price')).value = '0';
                    (<HTMLInputElement>document.getElementById('price')).value = r[0].delivery.price;
                } else {
                    // console.log('ERROR');
                    (<HTMLInputElement>document.getElementById('price')).value = '0';
                    // (<HTMLInputElement>document.getElementById('price')).value = r[0].delivery.price;
                }
                if ((this.orderDiscount !== null)) {
                    // console.log(this.orderPrice);
                    // (<HTMLInputElement>document.getElementById('price')).value = '0';
                    (<HTMLInputElement>document.getElementById('discount')).value = r[0].orderDiscount;
                } else {
                    // console.log('ERROR');
                    (<HTMLInputElement>document.getElementById('discount')).value = '0';
                    // (<HTMLInputElement>document.getElementById('price')).value = r[0].delivery.price;
                }
                if (this.orderShipmentId !== null) {
                    // console.log('ShipmentId : ' + this.orderShipmentId);
                    this.paymentForm.patchValue({ orderShipmentId: r[0].payment.orderShipmentId });
                }
                if ((this.orderPaymentTime !== null) && (this.orderPaymentTime !== undefined)) {
                    const chan = this.orderPaymentTime.split(':');
                    // console.log('X0 :' + chan[0].toString());
                    // console.log('X1 :' + chan[1].toString());
                    this.modelTime.hour = chan[0];
                    this.modelTime.minute = chan[1];
                }
                if ((this.orderBankId === null) || (this.orderBankId === undefined) ) {
                    // console.log('null-set to : ' + this.orderBankId);
                    this.bankService.fetchBank()
                        .subscribe((m) => {
                            // this.orderBankIdDefualt = m[0].bankId;
                            this.orderBankId = m[0].bankId;
                            // console.log(m[0].bankId);
                        });
                    this.paymentForm.patchValue({orderBankId: this.orderBankId});
                } else {
                    // console.log('BankId : ' + this.orderBankId);
                    this.paymentForm.patchValue({ orderBankId: r[0].payment.orderBankId });
                }
            });
    }

    getHold (id, hold) {
        this.sub = this.productService.hold(id, hold).subscribe((r: Product) => {
            this.productHold = r;
            //   console.log('Total : ' + this.productHold.productTotal);
            //   console.log('Hold : ' + this.productHold.productHold);
            //   console.log('Remain : ' + this.productHold.productRemain);
        });
    }

    // find check OrderODId into database //
    // fetchOrderODId() {
    //     this.counterService.fetchCounterOrder()
    //         .subscribe((result) => {
    //             // console.log(result);
    //             if (result.id) {
    //                 this.counterODId = result;
    //                 this.ODId = 'OD00000000';
    //                 this.rex = this.ODId.length - (this.counterODId.seq + 1).toString().length;
    //                 this.orderODId = this.ODId.slice(0, this.rex) + (this.counterODId.seq + 1).toString();
    //             } else {
    //                 this.orderODId = 'OD00000001';
    //             }
    //             // console.log(this.orderODId);
    //             // return this.orderODId;
    //         });
    // }

    onGoBack() {
        this.location.back();
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
        if (customerTel.length !== 10) {
            return this.alertWarning('Customer Telephone Wrong : \n กรุณาใส่ข้อมูลเบอร์โทรลุกค้าให้ครบ 10 หมายเลข ด้วยครับ.');
        }
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
            orderShipmentId: this.paymentForm.get('orderShipmentId').value,
            orderTracking: this.order.orderTracking
        };

        // if check product for Each stock () //
        // if check product for Each stock () //
        // this.orderProducts.forEach(p => delete p.remain);

        // test function onCompareProductsOrdersEdit for compare products //
        // alert(this.orderForm.value.orderId);
        const orderId = this.orderForm.value.orderId;
        // this.onCompareProductsOrdersEditChange(orderId, this.orderProducts);

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
            // orderCreated: this.order.orderCreated,
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

    async onClearHoldProductsOrdersEdit(orderId) {
        // if (orderId_products) {
        //     alert(this.order.orderId);
        // alert(orderId);
        // console.log(this.order.orderId);
        // let orderId = this.order.orderId;
        if (orderId) {
            await this.orderService.fetchViewOrderId(orderId).subscribe((r: Order) => {
                r.products.forEach((p) => {
                    // console.log('dataP = ' + JSON.stringify(p));
                    // console.log('dataP = ' + `${p.id} , ${p.name} , ${p.code} ${p.amount}`);
                    this.productService.hold(p.id, p.amount)
                        .subscribe((res: Product) => {
                            // console.log(res);
                            this.product = res;
                            this.product.productId = res.productId;
                            this.product.productTotal = res.productTotal;
                            this.product.productHold = res.productHold;
                            const newHold = (res.productHold - p.amount);
                            this.product.productRemain = (res.productTotal - res.productHold);
                            // alert(`${res.productId} , newHold =  ${newHold}`);
                            // console.log(`Remain Data ${res.productId} = (${res.productTotal}-${res.productHold}) => ${res.productTotal - res.productHold}`);
                            // return;
                            this.productService.updateHold(res.productId, newHold)
                                .subscribe();
                        });
                    // return true;
                });
            });
        }

        // await this.orderService.fetchViewOrderId(orderId).subscribe((r: Order) => {
        //     r.products.forEach((p) => {
        //         // console.log('dataP = ' + JSON.stringify(p));
        //         // console.log('dataP = ' + `${p.id} , ${p.name} , ${p.code} ${p.amount}`);
        //         this.productService.hold(p.id, p.amount)
        //             .subscribe((res: Product) => {
        //                 // console.log(res);
        //                 this.product = res;
        //                 this.product.productId = res.productId;
        //                 this.product.productTotal = res.productTotal;
        //                 this.product.productHold = res.productHold;
        //                 const newHold = (res.productHold - p.amount);
        //                 this.product.productRemain = (res.productTotal - res.productHold);
        //                 // alert(`${res.productId} , newHold =  ${newHold}`);
        //                 // console.log(`Remain Data ${res.productId} = (${res.productTotal}-${res.productHold}) => ${res.productTotal - res.productHold}`);
        //                 // return;
        //                 this.productService.updateHold(res.productId, newHold)
        //                    .subscribe();
        //             });
        //         return true;
        //     });
        // });
        // console.log(JSON.stringify(orderId_products));
        // }
    }

    onNewAddHoldProductsOrdersEdit(productId, amount) {
        // console.log(JSON.stringify(products));
        alert(JSON.stringify(productId));
        this.productService.fetchViewProductId(productId)
            .subscribe((res: Product) => {
                // console.log(res);
                this.product = res;
                this.product.productId = res.productId;
                this.product.productTotal = res.productTotal;
                const newHold = (Number(res.productHold) + Number(amount))
                // const newHold = (res.productHold + p.amount);
                this.product.productHold = newHold;
                this.product.productRemain = (Number(res.productTotal) - newHold);
                alert(`${res.productId} , newHold =  ${newHold}`);
                alert(JSON.stringify(this.product));
                console.log(JSON.stringify(this.product));
                // console.log(`Remain Data ${res.productId} = (${res.productTotal}-${res.productHold}) => ${res.productTotal - res.productHold}`);
                // return;
                // this.productService.updateHold(res.productId, newHold)
                //     .subscribe((r: Product) => {} );
                this.productService.updateProduct(this.product)
                    .subscribe((r: Product) => { console.log(r); } );
            });
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

    onPastePhone(e) {
        let content = <string>e.clipboardData.getData('text/plain');
        content = content.replace(/[^0-9]/g, '');
        e.preventDefault();
        // console.log(content);

        (<HTMLInputElement>document.getElementById('orderCustomerTel')).value = content;
        // this.customerForm.patchValue({
        //     orderCustomerTel: content
        // });
    }

    onKeypressPhone(e) {
        const notNumber = e.keyCode > 57 || e.keyCode < 48;
        const length = e.target.value.length;
        if (notNumber || length === 10) {
            e.preventDefault();
        }
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
        // console.log(product.id);
        // console.log(product.amount);
        // console.log(product.name);
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
    // function checkRole && alertData //

}
