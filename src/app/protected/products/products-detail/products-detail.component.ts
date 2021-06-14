import {Component, OnInit, ElementRef, Input, OnDestroy, ViewChild, AfterViewInit} from '@angular/core';
import {Historys, Product} from '../products.interface';
import {ProductsService} from '../products.service';
import {Counter} from '../counter.interface';
import {CounterService} from '../counter.service';
import Swal from 'sweetalert2';
import {Observable, Subscription} from 'rxjs';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {environment as env} from '../../../../environments/environment';
import {Router} from '@angular/router';
import 'rxjs/add/operator/map';

// add category api //
import {Category} from '../catagory.interface';
import {CategoryService} from '../category.service';
// add warehouse api //
// import {WarehousesService} from '../../stocks/warehouses.service';
// import {Warehouse} from '../../stocks/warehouses.interface';
// add inventory api //
// import {InventoryService} from '../../stocks/inventory.service';
// import {Inventory} from '../../stocks/inventory.interface';

import {TextMaskModule} from 'angular2-text-mask';
import {createAutoCorrectedDatePipe, createNumberMask, emailMask} from 'text-mask-addons/dist/textMaskAddons';

declare var $: any;

// import pdfmake use generate data//
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
// import xlsx-export Excel for export data//
import {XlsxService} from '../../../services/xlsx.service';

@Component({
    selector: 'app-products-detail',
    templateUrl: './products-detail.component.html',
    styleUrls: [
        './products-detail.component.scss',
        '../../../../assets/icon/icofont/css/icofont.scss'
    ]
})

export class ProductsDetailComponent implements OnInit, OnDestroy, AfterViewInit {

// ViewChild
    @ViewChild('modalDefault') modalDefaultView;
    @ViewChild('modalDefaultWizard') modalDefaultWizardView;
    @ViewChild('productFormModal') productFormModal;
    // @Input('modalDefault') modalDefault: any;
    // @Input('modalDefaultWizard') modalDefaultWizard: any;
    @ViewChild('Image') Image: ElementRef;

    // @Input() classHeader = false;
    // @Input() cardOptionBlock = false;
    // cardToggle = 'expanded';

    sub: Subscription;
    fileToUpload: File = null;
    imageUrl = env.serverAPI + '/images/image-blank.jpg';
    imageUrlBlank = env.serverAPI + '/images/image-blank.jpg';
    rowsOnPage = 25;
    filterQuery = '';
    public sortBy = '';
    public sortOrder = 'asc';

    public model: any;
    today: number = Date.now();
    modelPopup: NgbDateStruct = {} as NgbDateStruct;

    modelPopupProductLastupdate: NgbDateStruct;
    modelPopupProductCreated: NgbDateStruct;

    public date: { year: number, month: number, day: number };

    selectedFile = null;
    showImg = '';

    product: Product = {} as Product;
    productsHistorys: Historys[] = [] as Historys[];
    producthistorysLimit: number;
    productCache = '';

    counterCTId: Counter = {} as Counter;
    value1 = '';
    // public maskUsMobile = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    // public maskUsMobileCountryCode = ['+', '1', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    // public maskDate = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
    // public maskDateAuto = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
    // public maskZipCode = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
    // public maskDatePipe = createAutoCorrectedDatePipe('dd/mm/yyyy');

    // public maskUsAmount = createNumberMask({
    //     prefix: '$'
    // });
    //
    // public maskUsAmountDecimal = createNumberMask({
    //     prefix: '',
    //     suffix: ' $',
    //     allowDecimal: true
    // });
    //
    // public maskPercentage = createNumberMask({
    //     prefix: '',
    //     suffix: ' %',
    //     integerLimit: 2
    // });
    //
    // public emailMask = emailMask;

    products: Product[] = [] as Product[];
    categorys: Category[] = [] as Category[];
    // warehouses: Warehouse[] = [] as Warehouse[];
    // inventorys: Inventory[] = [] as Inventory[];
    isReadOnly = true;

    // resetFileDefault = '';
    ID: number;
    Name: string;
    checkRole: string;
    hiddenCheck = 'hidden';

    constructor(
        private productService: ProductsService,
        private counterService: CounterService,
        private categoryService: CategoryService,
        // private warehousesService: WarehousesService,
        // private inventoryService: InventoryService,
        private xlsxService: XlsxService,
        private router: Router
    ) {

        const today = new Date();
        const dd = today.getDate();
        const mm = today.getMonth() + 1;
        const yyyy = today.getFullYear();

        this.modelPopup.day = dd;
        this.modelPopup.month = mm;
        this.modelPopup.year = yyyy;

    }

    ngOnInit() {
        this.fetchProduct();
        this.fetchCategory();
        // this.fetchWarehouse();
        // this.fetchInventory();
        this.ID = JSON.parse(localStorage.getItem('ID'));
        this.Name = JSON.parse(localStorage.getItem('Name'));
        this.checkRole = JSON.parse(localStorage.getItem('Role'));
    }

    // isFloat($event) { return typeof($event) === 'number' && !Number($event); }
    // setTwoNumberDecimal($event) {
    //     this.value1 = parseFloat(this.value1).toFixed(2);
    //         // if ((this.value1)) {
    //             // this.value1 = parseFloat(this.value1).toFixed(2);
    //             //  return number();
    //         // }
    //         // return false;
    // }

    setDateNow() {

        this.modelPopup = {} as NgbDateStruct;

        const today = new Date();
        const dd = today.getDate();
        const mm = today.getMonth() + 1;
        const yyyy = today.getFullYear();

        this.modelPopup.day = dd;
        this.modelPopup.month = mm;
        this.modelPopup.year = yyyy;
    }

    // fetchCounter() {
    //     this.counterService.fetchCounterProduct()
    //         .subscribe((result) => {
    //             // console.log(result);
    //             this.counterCTId = result;
    //             this.CTId = 'CT00000000';
    //             this.rex = this.CTId.length - (this.counterCTId.seq + 1).toString().length;
    //             this.productCTId = this.CTId.slice(0, this.rex) + (this.counterCTId.seq + 1).toString();
    //             // console.log(this.productCTId);
    //         });
    // }

    fetchProduct() {
        this.sub = this.productService.fetchProduct()
            .map((m: Product[]) => {
                let x = 0;
                m.map(r => {
                    r.index = ++x;
                    if (r.productImage) {
                        r.productImage = `${env.serverAPI}/images/product/` + r.productImage;
                    } else {
                        r.productImage = `${env.serverAPI}/images/image-blank.jpg`;
                    }

                    if (r.productLastupdate) {
                        const dd = r.productLastupdate.toString().split('T');
                        const ddConv = dd[0].split('-');
                        r.productLastupdate = ddConv[2] + '-' + ddConv[1] + '-' + ddConv[0];
                    }
                    return r;
                });
                return m;
            })
            // .subscribe((r: Product[]) => this.products = r);
            .subscribe((p: Product[]) => {
                // console.log(p);
                this.products = p;
            });
    }

    fetchCategory() {
        this.sub = this.categoryService.fetchCategory()
        // .map((m: Product[]) => {
        //     let x = 0;
        //     m.map(r => {
        //         r.index = ++x;
        //         if (r.productImage) {
        //             r.productImage = `${env.serverAPI}/images/product/` + r.productImage;
        //         } else {
        //             r.productImage = `${env.serverAPI}/images/image-blank.jpg`;
        //         }
        //
        //         if (r.productLastupdate) {
        //             const dd = r.productLastupdate.toString().split('T');
        //             const ddConv = dd[0].split('-');
        //             r.productLastupdate = ddConv[2] + '-' + ddConv[1] + '-' + ddConv[0];
        //         }
        //         return r;
        //     });
        //     return m;
        // })
        // .subscribe((r: Product[]) => this.products = r);
            .subscribe((r: Category[]) => {
                // console.log(r);
                this.categorys = r;
            });
    }
    //
    // fetchWarehouse() {
    //     this.sub = this.warehousesService.fetchWarehouse()
    //         .subscribe((r: Warehouse[]) => {
    //             // console.log(r);
    //             this.warehouses = r;
    //         });
    // }

    // fetchInventory() {
    //     this.sub = this.inventoryService.fetchInventory()
    //         .subscribe((r: Inventory[]) => {
    //             // console.log(r);
    //             this.inventorys = r;
    //         });
    // }

    editProductId(id) {
        // alert(id);
        // this.router.navigate(['/management/customers/customers-edit/' + id + '/mode/edit']);
        this.router.navigate(['/management/products/products-edit/' + id ]);
    }

    onSubmit(frm) {

        this.product = frm.value;
        // this.product.productCTId = this.productCTId;
        // alert(JSON.stringify(frm.value));

        const {year, month, day} = frm.value.productLastupdate;
        this.product.productLastupdate = new Date(year, month - 1, day);

        const formData = new FormData();
        formData.append('file', this.selectedFile);

        if ((frm.value.productImage === '') || (frm.value.productImage === null)) {
            // console.log('*-- undefined --*');

            this.productService.addProduct(this.product)
                .subscribe(() => {
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
                    // Swal({
                    //     position: 'center',
                    //     type: 'success',
                    //     title: 'เพิ่มข้อมูลสาขา เรียบร้อยแล้ว',
                    //     showConfirmButton: false,
                    //     timer: 1200
                    // });
                    this.fetchProduct();
                    this.selectedFile = null;
                    // this.productFormModal.close('productModal');
                    this.modalDefaultWizardView.hide();
                    // this.productFormModal.close('modalDefaultWizard');
                });

        } else {
            // console.log('--not undefined--');
            this.productService.uploadFile(formData)
                .subscribe(result => {
                    this.product.productImage = result[0].name;
                    this.productService.addProduct(this.product)
                        .subscribe(() => {
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
                            // Swal({
                            //     position: 'center',
                            //     type: 'success',
                            //     title: 'เพิ่มข้อมูลสาขา เรียบร้อยแล้ว',
                            //     showConfirmButton: false,
                            //     timer: 1200
                            // });
                            this.fetchProduct();
                            this.selectedFile = null;
                            // this.productFormModal.close('productModal');
                            // this.modalDefaultWizardView.hide();
                            this.modalDefaultWizardView.hide();
                        });
                });
        }
        this.fetchProduct();
    }

    viewProduct(product: Product) {
        // this.productService.fetchViewProduct(product).subscribe((r) => this.product = r);
        this.productService.fetchViewProduct(product).map((m) => {

            m.productLastupdate = new Date(m.productLastupdate);
            m.productCreated = new Date(m.productCreated);

            const ddStart = new Date(m.productLastupdate);
            this.modelPopupProductLastupdate = {year: ddStart.getFullYear(), month: ddStart.getMonth() + 1, day: ddStart.getDate()};

            const ddCreate = new Date(m.productCreated);
            this.modelPopupProductCreated = {year: ddCreate.getFullYear(), month: ddCreate.getMonth() + 1, day: ddCreate.getDate()};

            return m;

        }).subscribe((r) => {

            this.product = r;
            if (r.productImage) {
                r.productImage = `${env.serverAPI}/images/product/` + r.productImage;
                this.showImg = r.productImage;
                this.productCache = r.productImage;
            } else {
                r.productImage = `${env.serverAPI}/images/image-blank.jpg`;
                this.showImg = r.productImage;
                this.productCache = r.productImage;
            }

        });
        this.isReadOnly = true;
    }

    // viewHisProduct(product: Product) {
    //     // this.productService.fetchViewProduct(product).subscribe((r) => this.product = r);
    //     this.productService.fetchViewProduct(product).map((m) => {
    //
    //         m.productLastupdate = new Date(m.productLastupdate);
    //         m.productCreated = new Date(m.productCreated);
    //
    //         const ddStart = new Date(m.productLastupdate);
    //         this.modelPopupProductLastupdate = {year: ddStart.getFullYear(), month: ddStart.getMonth() + 1, day: ddStart.getDate()};
    //
    //         const ddCreate = new Date(m.productCreated);
    //         this.modelPopupProductCreated = {year: ddCreate.getFullYear(), month: ddCreate.getMonth() + 1, day: ddCreate.getDate()};
    //
    //         return m;
    //
    //     }).subscribe((r) => {
    //
    //         this.product = r;
    //         if (r.productImage) {
    //             r.productImage = `${env.serverAPI}/images/product/` + r.productImage;
    //             this.showImg = r.productImage;
    //             this.productCache = r.productImage;
    //         } else {
    //             r.productImage = `${env.serverAPI}/images/image-blank.jpg`;
    //             this.showImg = r.productImage;
    //             this.productCache = r.productImage;
    //         }
    //
    //     });
    //     this.isReadOnly = true;
    // }

    // viewHisProduct(id: number) {
    viewHisProduct(product: Product) {
        // this.productService.fetchViewOrder(product).subscribe((r) => this.order = r);
        // alert(order);
        this.productService.fetchViewProductId(product.productId)
            .map((m) => {

                m.orderLastupdate = new Date(m.orderLastupdate);
                m.orderCreated = new Date(m.orderCreated);

                // const ddStart = new Date(m.orderLastupdate);
                // this.modelPopupOrderLastupdate = {year: ddStart.getFullYear(), month: ddStart.getMonth() + 1, day: ddStart.getDate()};
                //
                // const ddCreate = new Date(m.orderCreated);
                // this.modelPopupOrderCreated = {year: ddCreate.getFullYear(), month: ddCreate.getMonth() + 1, day: ddCreate.getDate()};

                return m;

            })
            .subscribe((r) => {
                this.product = r;
                if (r.productImage) {
                    r.productImage = `${env.serverAPI}/images/product/` + r.productImage;
                    this.showImg = r.productImage;
                    this.productCache = r.productImage;
                } else {
                    r.productImage = `${env.serverAPI}/images/image-blank.jpg`;
                    this.showImg = r.productImage;
                    this.productCache = r.productImage;
                }
                this.productsHistorys = r.historys;
                this.product.historys = r.historys;
                if (this.product.historys.length <= 10) {
                    this.producthistorysLimit = this.product.historys.length;
                    this.product.historys = r.historys.reverse().slice(0, this.product.historys.length);
                } else {
                    this.producthistorysLimit = 10;
                    this.product.historys = r.historys.reverse().slice(0, 10);
                }
                // console.log(this.ordershistorysLimit);
                // console.log(JSON.stringify(this.order.historys));

                // console.log('Length = ' + this.order.historys.length);
                //
                //     let count = 0 ;
                //     let sum = 0 ;
                //     const many = range(1, this.order.historys.length);
                //     const lastThree = many.pipe(takeLast(5));
                //     lastThree.subscribe(x => {
                //         console.log(x);
                //         count = count + x;
                //         sum++;
                //     });
                //     console.log('Count : ' + count + ', Sum = ' + sum);

                // if (r.orderImage) {
                //     r.orderImage = `${env.serverAPI}/images/order/` + r.orderImage;
                //     // this.showImg = r.orderImage;
                //     // this.orderCache = r.orderImage;
                // } else {
                //     r.orderImage = `${env.serverAPI}/images/image-blank.jpg`;
                //     // this.showImg = r.orderImage;
                //     // this.orderCache = r.productImage;
                // }
            });
        this.isReadOnly = true;
    }

    editProduct(product: Product) {
        this.productService.fetchViewProduct(product).map((m) => {

            m.productLastupdate = new Date(m.productLastupdate);
            m.productCreated = new Date(m.productCreated);

            const ddStart = new Date(m.productLastupdate);
            this.modelPopupProductLastupdate = {year: ddStart.getFullYear(), month: ddStart.getMonth() + 1, day: ddStart.getDate()};

            const ddCreate = new Date(m.productCreated);
            this.modelPopupProductCreated = {year: ddCreate.getFullYear(), month: ddCreate.getMonth() + 1, day: ddCreate.getDate()};

            return m;

        }).subscribe((r) => {

            this.product = r;
            if (r.productImage) {
                r.productImage = `${env.serverAPI}/images/product/` + r.productImage;
                this.showImg = r.productImage;
                this.productCache = r.productImage;
            } else {
                r.productImage = `${env.serverAPI}/images/image-blank.jpg`;
                this.showImg = r.productImage;
                this.productCache = r.productImage;
            }
        });
        this.isReadOnly = false;
    }

    // resetFile(state?: string) {
    //     this.imageUrl = state === 'add' ? this.imageUrlBlank : '';
    //     this.resetFileDefault = '';
    // }

    updateProduct(frm) {
        // this.product = frm.value;
        // alert(JSON.stringify(frm.value));

        const formData = new FormData();
        formData.append('file', this.selectedFile);

        this.product.productName = frm.value.productName;
        this.product.productComment = frm.value.productComment;
        const {year, month, day} = frm.value.productLastupdate;
        this.product.productLastupdate = new Date(year, month - 1, day);
        // const {year, month, day} = frm.value.productCreated;
        // this.product.productCreated = new Date(year, month - 1, day);

        // this.product.productImage = frm.value.productImage;

        // ถ้ามีการแก้ไขรูปภาพใหม่
        if (this.selectedFile) {
            // console.log('Images TRUE =>> ' + this.selectedFile.name);
            this.productService.uploadFile(formData)
                .subscribe(result => {
                    this.product.productImage = result[0].name;
                    this.productService.updateProduct(this.product)
                        .subscribe((r) => {
                            const toast = Swal.mixin({
                                toast: true,
                                position: 'top-end',
                                showConfirmButton: false,
                                timer: 3000
                            });
                            toast({
                                type: 'success',
                                title: 'แก้ไขข้อมูล เรียบร้อยแล้ว'
                            });
                            // Swal({
                            //     position: 'center',
                            //     type: 'success',
                            //     title: 'แก้ไขข้อมูลพนักงาน เรียบร้อยแล้ว',
                            //     // title: 'Your work has been saved',
                            //     showConfirmButton: false,
                            //     timer: 1200
                            // });
                        });
                    this.fetchProduct();
                    this.selectedFile = null;
                    this.modalDefaultView.hide();
                    // this.modalDefaultWizardView.hide();
                });

        } else {
            this.productService.fetchViewProduct(this.product)
                .subscribe(result => {
                    this.product.productImage = result.productImage;
                    this.productService.updateProduct(this.product)
                        .subscribe((r) => {
                            // console.log(result.productImage);
                            // alert(this.product.productImage);
                            const toast = Swal.mixin({
                                toast: true,
                                position: 'top-end',
                                showConfirmButton: false,
                                timer: 3000
                            });
                            toast({
                                type: 'success',
                                title: 'แก้ไขข้อมูล เรียบร้อยแล้ว'
                            });
                            // Swal({
                            //     position: 'center',
                            //     type: 'success',
                            //     title: 'แก้ไขข้อมูลพนักงาน เรียบร้อยแล้ว',
                            //     // title: 'Your work has been saved',
                            //     showConfirmButton: false,
                            //     timer: 1200
                            // });
                        });
                    this.fetchProduct();
                    this.selectedFile = null;
                    this.modalDefaultView.hide();
                    // this.modalDefaultWizardView.hide();
                });
        }
        this.fetchProduct();
    }

    deleteProduct(product: Product) {
        Swal({
            // title: 'Are you sure?',
            // text: "You won't be able to revert this!",
            title: '\nคุณต้องการที่จะลบข้อมูล ใช่ไหม?',
            text: '\nคุณจะไม่สามารถย้อนกลับได้!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            // confirmButtonText: 'Yes, delete it!'
            confirmButtonText: 'ใช่, ฉันต้องการ',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.value) {
                this.productService.deleteProduct(product)
                    .subscribe((r) => {
                        // this.data = this.productService.fetchProduct();
                        this.fetchProduct();
                    });
            }
        });
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
                this.product.productImage = event.target.result;
                this.showImg = event.target.result;
            };
            reader.readAsDataURL(this.fileToUpload);
        } else {
            // ไม่เลือกรูปภาพ  ให้โชว์ภาพว่างๆ
            this.showImg = this.productCache;
            this.product.productImage = this.productCache;
        }
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

    // ngOnDestroy() {
    //     this.sub.unsubscribe();
    // }
    // Destroy data unsubscript //
    ngOnDestroy() {
        if (this.sub !== null) {
            this.sub.unsubscribe();
        }
    }
    ngAfterViewInit(): void {
        setInterval(() => {
            //     // console.log(this.table.nativeElement.innerText);
            //     // console.log(this.table.nativeElement.innerHTML);
            //     console.log(this.content.nativeElement.innerHTML);
            //     // console.log(this.table.nativeElement.value);
            // console.log(this.products.length);
            this.fetchProduct();
        }, 5000);
    }

    async addStockInputTotal(id: number) {
        const ipAPI = 'https://api.ipify.org?format=json';
        const Val = '';
        const inputValue = fetch(ipAPI)
            .then(response => response.json())
            .then(data => data.ip);

        const {value: inputTotal} = await Swal({
            title: 'เพิ่มจำนวนสต๊อกสินค้าเข้า\n(1 - 999)',
            input: 'number',
            inputValue: '0',
            inputAttributes: {
                min: '0',
                max: '999',
                step: '1'
            },
            inputClass: 'text-success',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33a',
            confirmButtonText: 'เพิ่ม',
            cancelButtonText: 'ยกเลิก',
            inputValidator: (value) => {
                return !value && 'กรุณากรอกกรอกข้อมูลเป็นตัวเลข ที่คุณต้องการ!';
            }
        });

        if (inputTotal) {
            if (Number(inputTotal) === 0) {
                return this.alertWarning('ข้อมูลผิดพลาด กรุณาตรวจสอบใหม่');
            }
            if (inputTotal.toLocaleString().length > 3) {
                return this.alertWarning('ข้อมูลผิดพลาด กรุณาตรวจสอบใหม่' + inputTotal.toLocaleString().length );
            }
            this.sub = this.productService.fetchViewProductId(id)
                .subscribe((r: Product) => {
                    this.product = r;
                    this.product.productId = r.productId;
                    const newItemTotal = (Number(r.productTotal) + Number(inputTotal));
                    const newItemUpdate = `${r.productTotal} + ${inputTotal} => ${newItemTotal}`;
                    this.product.productTotal = newItemTotal;
                    this.product.productLastupdate = new Date();
                    // add historys //
                    const hisName = 'AddStock';
                    const hisRemark = 'เพิ่มสต็อกสินค้าจาก ' + newItemUpdate;
                    this.pushHistorysData(hisName, hisRemark);
                    // add historys //
                    if ((this.product) && (this.checkRoleData())) {
                        // ทำการเช็ค id เพื่อ เพื่มข้อมูลสต๊อก //
                        Swal({
                            title: 'คุณต้องการที่จะเพิ่มสต๊อกใช่ไหม?',
                            text: `จำนวนสินค้าที่เพิ่มขึ้น ${newItemUpdate}`,
                            // type: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33a',
                            confirmButtonText: 'เพิ่มสต๊อก',
                            cancelButtonText: 'ยกเลิก'
                        }).then((result) => {
                            if (result.value) {
                                // อัพเดทข้อมูลลง Database เฉพาะ ProductTotal ใหม่ //
                                this.productService.updateProduct(this.product)
                                    .subscribe(() => {
                                        const textAlert = `เพิ่มสต๊อกสินค้า เรียบร้อยแล้ว
                                                        \nเพิ่มสินค้าจำนวน ${newItemUpdate}
                                                        \nสต๊อกใหม่เป็น ${newItemTotal} Pcs.`;
                                        this.alertSuccess(textAlert);
                                        this.fetchProduct();
                                    });
                            }
                        });
                        // ทำการเช็ค id เพื่อ เพื่มข้อมูลสต๊อก //
                    }
                });
        }
    }

    async deductStockInputTotal(id: number) {
        const ipAPI = 'https://api.ipify.org?format=json';
        const Val = '';
        const inputValue = fetch(ipAPI)
            .then(response => response.json())
            .then(data => data.ip);

        const {value: inputTotal} = await Swal({
            title: 'ลดจำนวนสต๊อกสินค้าเข้า\n(1 - 999)',
            input: 'number',
            inputValue: '0',
            inputAttributes: {
                min: '0',
                max: '999',
                step: '1'
            },
            inputClass: 'text-warning',
            showCancelButton: true,
            confirmButtonColor: '#e48334',
            cancelButtonColor: '#d33a',
            confirmButtonText: 'ลด',
            cancelButtonText: 'ยกเลิก',
            inputValidator: (value) => {
                return !value && 'กรุณากรอกกรอกข้อมูลเป็นตัวเลข ที่คุณต้องการ!';
            }
        });

        if (inputTotal) {
            if (Number(inputTotal) === 0) {
                return this.alertWarning('ข้อมูลผิดพลาด กรุณาตรวจสอบใหม่');
            }
            if (inputTotal.toLocaleString().length > 3) {
                return this.alertWarning('ข้อมูลผิดพลาด กรุณาตรวจสอบใหม่');
            }
            this.sub = this.productService.fetchViewProductId(id)
                .subscribe((r: Product) => {
                    this.product = r;
                    this.product.productId = r.productId;
                    const newItemTotal = (Number(r.productTotal) - Number(inputTotal));
                    const newItemUpdate = `${r.productTotal} - ${inputTotal} => ${newItemTotal}`;
                    this.product.productTotal = newItemTotal;
                    this.product.productLastupdate = new Date();
                    // add historys //
                    const hisName = 'DeductStock';
                    const hisRemark = 'ลดสต็อกสินค้าจาก ' + newItemUpdate;
                    this.pushHistorysData(hisName, hisRemark);
                    // add historys //
                    if ((this.product) && (this.checkRoleData())) {
                        // ทำการเช็ค id เพื่อ เพื่มข้อมูลสต๊อก //
                        Swal({
                            title: 'คุณต้องการที่จะลดสต๊อกใช่ไหม?',
                            text: `จำนวนสินค้าที่ลดลง ${newItemUpdate}`,
                            // type: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#e48334',
                            cancelButtonColor: '#d33a',
                            confirmButtonText: 'ลดสต๊อก',
                            cancelButtonText: 'ยกเลิก'
                        }).then((result) => {
                            if (result.value) {
                                // อัพเดทข้อมูลลง Database เฉพาะ ProductTotal ใหม่ //
                                this.productService.updateProduct(this.product)
                                    .subscribe(() => {
                                        const textAlert = `ลดสต๊อกสินค้า เรียบร้อยแล้ว
                                                            \nลดสต๊อกสินค้าจำนวน ${newItemUpdate}
                                                            \nสต๊อกใหม่เป็น ${newItemTotal} Pcs.`;
                                        this.alertSuccess(textAlert);
                                        this.fetchProduct();
                                    });
                            }
                        });
                        // ทำการเช็ค id เพื่อ เพื่มข้อมูลสต๊อก //
                    }
                });
        }
    }

    async addStockInputHold(id: number) {
        const ipAPI = 'https://api.ipify.org?format=json';
        const Val = '';
        const inputValue = fetch(ipAPI)
            .then(response => response.json())
            .then(data => data.ip);

        const {value: inputHold} = await Swal({
            title: 'เพิ่มจำนวน hold สินค้าเข้า\n(1 - 999)',
            input: 'number',
            inputValue: '0',
            inputAttributes: {
                min: '0',
                max: '999',
                step: '1'
            },
            inputClass: 'text-success',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33a',
            confirmButtonText: 'เพิ่ม hold',
            cancelButtonText: 'ยกเลิก',
            inputValidator: (value) => {
                return !value && 'กรุณากรอกกรอกข้อมูลเป็นตัวเลข ที่คุณต้องการ!';
            }
        });

        if (inputHold) {
            if (Number(inputHold) === 0) {
                return this.alertWarning('ข้อมูลผิดพลาด กรุณาตรวจสอบใหม่');
            }
            if (inputHold.toLocaleString().length > 3) {
                return this.alertWarning('ข้อมูลผิดพลาด กรุณาตรวจสอบใหม่');
            }
            this.sub = this.productService.fetchViewProductId(id)
                .subscribe((r: Product) => {
                    this.product = r;
                    this.product.productId = r.productId;
                    const newItemHold = (Number(r.productHold) + Number(inputHold));
                    const newItemUpdate = `${r.productHold} + ${inputHold} => ${newItemHold}`;
                    this.product.productHold = newItemHold;
                    this.product.productLastupdate = new Date();
                    // add historys //
                    const hisName = 'AddHold';
                    const hisRemark = 'เพิ่มจองสินค้าจาก ' + newItemUpdate;
                    this.pushHistorysData(hisName, hisRemark);
                    // add historys //
                    if ((this.product) && (this.checkRoleData())) {
                        // ทำการเช็ค id เพื่อ เพื่มข้อมูลสต๊อก //
                        Swal({
                            title: 'คุณต้องการที่จะเพิ่ม hold ใช่ไหม?',
                            text: `จำนวน hold ของสินค้าที่เพิ่มขึ้น ${newItemUpdate}`,
                            // type: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33a',
                            confirmButtonText: 'เพิ่ม hold',
                            cancelButtonText: 'ยกเลิก'
                        }).then((result) => {
                            if (result.value) {
                                // อัพเดทข้อมูลลง Database เฉพาะ ProductTotal ใหม่ //
                                this.productService.updateProduct(this.product)
                                    .subscribe(() => {
                                        const textAlert = `เพิ่ม hold สินค้า เรียบร้อยแล้ว
                                                            \nเพิ่ม hold ของสินค้าจำนวน ${newItemUpdate}
                                                            \n hold ใหม่เป็น ${newItemHold} Pcs.`;
                                        this.alertSuccess(textAlert);
                                        this.fetchProduct();
                                    });
                            }
                        });
                        // ทำการเช็ค id เพื่อ เพื่มข้อมูลสต๊อก //
                    }
                });
        }
    }

    async deductStockInputHold(id: number) {
        const ipAPI = 'https://api.ipify.org?format=json';
        const Val = '';
        const inputValue = fetch(ipAPI)
            .then(response => response.json())
            .then(data => data.ip);

        const {value: inputHold} = await Swal({
            title: 'ลดจำนวน hold ของจำนวนสินค้า\n(1 - 999)',
            input: 'number',
            inputValue: '0',
            inputAttributes: {
                min: '0',
                max: '999',
                step: '1'
            },
            inputClass: 'text-warning',
            showCancelButton: true,
            confirmButtonColor: '#e48334',
            cancelButtonColor: '#d33a',
            confirmButtonText: 'ลด hold',
            cancelButtonText: 'ยกเลิก',
            inputValidator: (value) => {
                return !value && 'กรุณากรอกกรอกข้อมูลเป็นตัวเลข ที่คุณต้องการ!';
            }
        });

        if (inputHold) {
            if (Number(inputHold) === 0) {
                return this.alertWarning('ข้อมูลผิดพลาด กรุณาตรวจสอบใหม่');
            }
            if (inputHold.toLocaleString().length > 3) {
                return this.alertWarning('ข้อมูลผิดพลาด กรุณาตรวจสอบใหม่');
            }
            this.sub = this.productService.fetchViewProductId(id)
                .subscribe((r: Product) => {
                    this.product = r;
                    this.product.productId = r.productId;
                    const newItemHold = (Number(r.productHold) - Number(inputHold));
                    const newItemUpdate = `${r.productHold} - ${inputHold} => ${newItemHold}`;
                    this.product.productHold = newItemHold;
                    this.product.productLastupdate = new Date();
                    // add historys //
                    const hisName = 'DeductHold';
                    const hisRemark = 'ลดจองสินค้าจาก ' + newItemUpdate;
                    this.pushHistorysData(hisName, hisRemark);
                    // add historys //
                    if ((this.product) && (this.checkRoleData())) {
                        // ทำการเช็ค id เพื่อ เพื่มข้อมูลสต๊อก //
                        Swal({
                            title: 'คุณต้องการที่จะลด hold ใช่ไหม?',
                            text: `จำนวน hold ที่ลดลง ${newItemUpdate}`,
                            // type: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#e48334',
                            cancelButtonColor: '#d33a',
                            confirmButtonText: 'ลด hold',
                            cancelButtonText: 'ยกเลิก'
                        }).then((result) => {
                            if (result.value) {
                                // อัพเดทข้อมูลลง Database เฉพาะ ProductTotal ใหม่ //
                                this.productService.updateProduct(this.product)
                                    .subscribe(() => {
                                        const textAlert = `ลด hold ของสินค้า เรียบร้อยแล้ว
                                                            \n ลด hold สินค้าจำนวน ${newItemUpdate}
                                                            \n hold ใหม่เป็น ${newItemHold} Pcs.`;
                                        this.alertSuccess(textAlert);
                                        this.fetchProduct();
                                    });
                            }
                        });
                        // ทำการเช็ค id เพื่อ เพื่มข้อมูลสต๊อก //
                    }
                });
        }
    }

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
    public pushHistorysData(hisName, hisRemark) {
        if (this.checkRoleData()) {
            // this.alertSuccess(`คุณมีสิทธื์ใช้งาน เพื่อเข้าถึงข้อมูลนี้ได้`);
            this.product.historys.push({
                hisName: hisName,
                hisRemark: hisRemark,
                sellerId: this.ID,
                sellerName: this.Name,
                lastUpdate: new Date()
            });
        } else {
            return this.alertWarning(`คุณไม่มีสิทธื์เข้าถึงข้อมูลนี้ กรุณาตรวจสอบอีกครั้ง!`);
        }
    }

    public checkRoleData() {
        // this.ID = JSON.parse(localStorage.getItem('ID'));
        // this.Name = JSON.parse(localStorage.getItem('Name'));
        // this.checkRole = JSON.parse(localStorage.getItem('Role'));
        const roleValue = this.checkRole.toString().toLowerCase();
        // alert(roleValue);
        // if (roleValue === ('admin' || 'superadmin')) {
        if (roleValue === ('superadmin')) {
            // this.alertSuccess(`คุณมีสิทธื์ใช้งาน เพื่อเข้าถึงข้อมูลนี้ได้`);
            return true;
        } else {
            // this.alertWarning(`คุณไม่มีสิทธื์เข้าถึงข้อมูลนี้ กรุณาตรวจสอบอีกครั้ง!`);
            return false;
        }
    }

    onCheckboxChangeFn(event) {
        // console.log(event);
        // alert(event);
        $('#selected').change( function() {
            if ( $(this).is(':checked') ) {
                alert('checked');
            } else {
                alert('unchecked');
            }
        });
    }

    genProductPDFmake(products) {
        // alert(products);
        if (products.length > 0) {
            // this.alertSuccess('genProduct = ' + JSON.stringify(products));
        }
    }

    // genProductBarcode(products) {
    //     alert('products = ' + products);
    //     this.alertSuccess('productBarcode = ' + JSON.stringify(products));
    // }

    genProductBarcode(products) {
        // this.alertSuccess('productBarcode = ' + JSON.stringify(products));

        if (products.length !== 0) {
            // alert('Data-Selected-orders count = ' + selected.length);
            const chkCount = true;
            const itemsCount = products.length;
            const now = new Date();
            const nameDownload = now.getDate() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + now.getFullYear()
                + 'T' + now.getHours() + '.' + now.getMinutes();
            const ccc = '';
            // const pageSizeset = 'a7';
            const pageSizeset = 'a4';
            // const pageOrientationset = 'landscape';
            const pageOrientationset = 'portrait';

            // console.log('Count = ' + itemsCount);
            // selected.forEach((r) => {
            //     console.log(r)
            // });

            if (chkCount) {
                pdfMake.fonts = {
                    Athiti: {
                        normal: 'Athiti-Light.ttf',
                        bold: 'Athiti-Bold.ttf',
                        italics: 'Athiti-Regular.ttf',
                        bolditalics: 'Athiti-Medium.ttf'
                    },
                    Sarabun: {
                        normal: 'Sarabun-Regular.ttf',
                        bold: 'Sarabun-Bold.ttf',
                        light: 'Sarabun-Light.ttf',
                        thin: 'Sarabun-Thin.ttf'
                    },
                    Code128: {
                        normal: 'code128.ttf'
                    },
                    Ean13: {
                        normal: 'ean13.ttf'
                    },
                    Fre3of9x: {
                        normal: 'fre3of9x.ttf'
                    },
                    Free3of9: {
                        normal: 'free3of9.ttf'
                    },
                    Roboto: {
                        normal: 'Roboto-Regular.ttf',
                        bold: 'Roboto-Medium.ttf',
                        italics: 'Roboto-Italic.ttf',
                        bolditalics: 'Roboto-MediumItalic.ttf'
                    }
                };

                pdfMake.vfs = pdfFonts.pdfMake.vfs;
                const contents = [];

                // for loop print PDF //
                let x = 0;
                // Start selected forEach //
                this.products.forEach(p => {
                    // var orderTotal = '';
                    // var re = /\n/gi;
                    // if ((p.orderRemark !== null) || (p.orderRemark !== '')) {
                    //     if (p.orderRemark.search(re) === -1) {
                    //         var orderRemarkList = p.orderRemark;
                    //     } else {
                    //         var orderRemarkList = p.orderRemark.replace('\n', '');
                    //     }
                    // } else {
                    //     var orderRemarkList = p.orderRemark;
                    // }
                    // var orderShipmentName = '';
                    // var orderShipmentList = '';
                    // var orderProductList = '';
                    // var productMax = 0;
                    // var textPage = '';
                    // const y = 1;
                    x++;
                    // if (p.payment.orderShipmentId !== null) {
                    //     this.shipments.filter((rec: Shipment) => {
                    //         if (rec.shipmentId === p.payment.orderShipmentId) {
                    //             orderShipmentName = rec.shipmentName;
                    //         }
                    //     });
                    // }
                    // if (p.orderTotal.toString().length > 3) {
                    //     orderTotal += p.orderTotal + '฿';
                    // } else {
                    //     orderTotal += p.orderTotal + '฿';
                    // }

                    // if (p.payment.method === 'cod') {
                    //     orderShipmentList += orderShipmentName.toLocaleUpperCase()
                    //         + '/' + p.payment.method.toLocaleUpperCase() + '/' + orderTotal;
                    // }
                    // if (p.payment.method === 'banktranfer') {
                    //     orderShipmentList += orderShipmentName.toLocaleUpperCase();
                    // }
                    // if (p.products.length > 0) {
                    //     p.products.forEach(r => {
                    //         productMax = p.products.length;
                    //         if ((y < productMax) && (y !== productMax)) {
                    //             orderProductList += (r.code + '(' + r.amount + '), ');
                    //         } else {
                    //             orderProductList += (r.code + '(' + r.amount + ')');
                    //         }
                    //         y++;
                    //     });
                    // }

                    // set pageBreak //
                    // if ((x < itemsCount)) {
                    //     textPage = 'after';
                    // } else {
                    //     textPage = '';
                    // }

                    const row_cont =
                        [
                            {
                                alignment: 'justify',
                                layout: 'lightHorizontalLines', // optional
                                table: {
                                    // headers are automatically repeated if the table spans over multiple pages
                                    // you can declare how many rows should be treated as headers
                                    headerRows: 1,
                                    // headerRows: 1,
                                    // widths: [ '*', 'auto', 100, '*' ],
                                    // widths: [ '*', 'auto'],
                                    body: [
                                        // [ 'First', 'Second', 'Third', 'The last one' ],
                                        // [ 'Value 1', 'Value 2', 'Value 3', 'Value 4' ],
                                        // [
                                        //   {text: 'Bold 1234', normal: true, style: 'barcodeCode128' },
                                        //   {text: aaa, style: 'header'}, {text: bbb, font: 'Sarabun'},
                                        // {text: ccc, style: 'header', bold: true, pageBreak: 'after'},
                                        {text: ccc, style: 'header'},
                                        // body
                                        // ]
                                    ]
                                }
                            },
                            // {text: 'Headers', pageBreak: 'before', style: 'header'},
                            // {text: '2 side columns', style: 'header', pageBreak: 'before'},
                            {
                                alignment: 'justify',
                                columns:
                                    [
                                        {
                                            alignment: 'left',
                                            fontSize: 10,
                                            font: 'Sarabun',
                                            bold: true,
                                            text: x + '. ' + p.productCodename + ' : ' + p.productName
                                        },
                                        // {
                                        //     // alignment: 'right',
                                        //     // font: 'Sarabun',
                                        //     // fontSize: 10,
                                        //     // bold: true,
                                        //     // text: ''
                                        //     text: '*' + p.productCodename + '*',
                                        //     font: 'Fre3of9x',
                                        //     fontSize: 30,
                                        //     alignment: 'center',
                                        //     border: [false, false, false, false],
                                        //     margin: [0, 0, 0, 0],
                                        // }

                                        {
                                            style: 'tableExample',
                                            table: {
                                                widths: ['*', '*'],
                                                // widths: [210],
                                                // heights: [20, 30, 20],
                                                body:
                                                    [
                                                        // [{
                                                        //     text: '',
                                                        //     // text: orderProductList,
                                                        //     border: [false, false, false, false],
                                                        //     style: 'tableExample',
                                                        //     font: 'Sarabun',
                                                        //     fontSize: 11,
                                                        //     bold: true,
                                                        //     colSpan: 2,
                                                        //     alignment: 'left'
                                                        // }],
                                                        // [{
                                                        //     text: ccc,
                                                        //     border: [false, false, false, false],
                                                        //     style: 'tableExample',
                                                        //     colSpan: 2,
                                                        //     alignment: 'left'
                                                        // }],
                                                        // [{text: ccc, border:[false,false,false,false],
                                                        // style: 'tableExample', colSpan: 2, alignment: 'left'}],
                                                        // [{text: ccc, border:[false,false,false,false],
                                                        // style: 'tableExample', colSpan: 2, alignment: 'left'}],
                                                        [
                                                            {
                                                                text: '*' + p.productCodename + '*',
                                                                font: 'Fre3of9x',
                                                                fontSize: 30,
                                                                alignment: 'center',
                                                                border: [false, false, false, false],
                                                                margin: [0, 0, 0, 0],
                                                                colSpan: 2,
                                                            },
                                                        ],
                                                        [
                                                            {
                                                                text: p.productCodename,
                                                                font: 'Sarabun',
                                                                fontSize: 8,
                                                                bold: true,
                                                                border: [false, false, false, false],
                                                                colSpan: 2,
                                                                margin: [0, -5, 0, 0],
                                                                alignment: 'center',
                                                            },
                                                        ]
                                                    ]
                                            }
                                        },
                                    ],
                            },
                            // {
                            //     alignment: 'left',
                            //     font: 'Sarabun',
                            //     fontSize: 10,
                            //     bold: true,
                            //     border: [false, false, false, false],
                            //     text: p.productName + '  code.: ' + p.productCodename
                            // },
                            // {
                            //     alignment: 'left',
                            //     font: 'Sarabun',
                            //     fontSize: 10,
                            //     bold: true,
                            //     border: [false, false, false, false],
                            //     text: ''
                            // },
                            // {
                            //     alignment: 'left',
                            //     font: 'Sarabun',
                            //     fontSize: 10,
                            //     bold: false,
                            //     border: [false, false, false, false],
                            //     text: p.productName
                            // },
                            // {
                            //     alignment: 'left',
                            //     font: 'Sarabun',
                            //     fontSize: 10,
                            //     bold: false,
                            //     border: [false, false, false, false],
                            //     text:  p.productName
                            // },
                            // {
                            //     alignment: 'left',
                            //     font: 'Sarabun',
                            //     fontSize: 10,
                            //     bold: true,
                            //     border: [false, false, false, false],
                            //     text: 'productName: ' +  p.productName
                            // },
                            // {
                            //     alignment: 'left',
                            //     font: 'Sarabun',
                            //     fontSize: 8,
                            //     bold: false,
                            //     border: [false, false, false, false],
                            //     text: 'productTotal: ' +  p.productTotal
                            // },
                            // {
                            //     style: 'tableExample',
                            //     table: {
                            //         widths: ['*', '*'],
                            //         // widths: [210],
                            //         // heights: [20, 30, 20],
                            //         body:
                            //             [
                            //                 // [{
                            //                 //     text: '',
                            //                 //     // text: orderProductList,
                            //                 //     border: [false, false, false, false],
                            //                 //     style: 'tableExample',
                            //                 //     font: 'Sarabun',
                            //                 //     fontSize: 11,
                            //                 //     bold: true,
                            //                 //     colSpan: 2,
                            //                 //     alignment: 'left'
                            //                 // }],
                            //                 // [{
                            //                 //     text: ccc,
                            //                 //     border: [false, false, false, false],
                            //                 //     style: 'tableExample',
                            //                 //     colSpan: 2,
                            //                 //     alignment: 'left'
                            //                 // }],
                            //                 // [{text: ccc, border:[false,false,false,false],
                            //                 // style: 'tableExample', colSpan: 2, alignment: 'left'}],
                            //                 // [{text: ccc, border:[false,false,false,false],
                            //                 // style: 'tableExample', colSpan: 2, alignment: 'left'}],
                            //                 [
                            //                     {
                            //                         text: '*' + p.productCodename + '*',
                            //                         font: 'Fre3of9x',
                            //                         fontSize: 30,
                            //                         alignment: 'center',
                            //                         border: [false, false, false, false],
                            //                         margin: [0, 0, 0, 0],
                            //                         colSpan: 2,
                            //                     },
                            //                 ],
                            //                 [
                            //                     {
                            //                         text: p.productCodename,
                            //                         font: 'Sarabun',
                            //                         fontSize: 8,
                            //                         bold: true,
                            //                         border: [false, false, false, false],
                            //                         colSpan: 2,
                            //                         margin: [0, -5, 0, 0],
                            //                         alignment: 'center',
                            //                     },
                            //                 ]
                            //             ]
                            //     }
                            // },
                            // {
                            //     text: ccc,
                            //     style: 'header',
                            //     pageBreak: textPage
                            // }
                            // '\n',
                            // {text: ccc, style: 'header',  'after'}
                        ];

                    contents.push(row_cont);
                });
                // End selected forEach //

                const dataGen = {
                    pageSize: pageSizeset,
                    // pageSize: {
                    //   width: 210,
                    //   height: 298
                    // },
                    // pageOrientation: 'landscape',
                    // pageOrientation: 'portal',
                    pageOrientation: pageOrientationset,
                    pageMargins: [35, 15, 35, 15],
                    content: [contents],
                    styles: {
                        header: {
                            font: 'Sarabun',
                            fontSize: 12,
                            alignment: 'justify'
                        },
                        barcodeCode128: {
                            font: 'Code128',
                            fontSize: 50,
                            normal: true,
                            alignment: 'justify'
                        },
                        barcodeEan13: {
                            font: 'Ean13',
                            fontSize: 50,
                            height: 10,
                            normal: true,
                            alignment: 'justify'
                        },
                        Fre3of9x: {
                            font: 'Fre3of9x',
                            fontSize: 50,
                            height: 10,
                            normal: true,
                            alignment: 'justify'
                        },
                        Free3of9: {
                            font: 'Free3of9',
                            fontSize: 40,
                            height: 10,
                            normal: true,
                            alignment: 'justify'
                        },
                        textbarcode: {
                            font: 'Sarabun',
                            fontSize: 12,
                            alignment: 'justify'
                        },
                        spit2left: {
                            alignment: 'left'
                        },
                        spit2right: {
                            alignment: 'right'
                        },
                        tableExample: {
                            margin: [0, 0, 0, 0]
                        },
                        tableHeader: {
                            bold: true,
                            fontSize: 12,
                            color: 'black'
                        }
                    },
                    defaultStyle: {
                        // columnGap: 10
                    }
                };

                // const pdfData = pdfMake.createPdf(dataGen).download('(' + itemsCount + ')barcode_' + nameDownload + '.pdf');
                // pdfMake.createPdf(dataGen).print(pdfData);
                pdfMake.createPdf(dataGen).print();

            }
        }

    }

    genProductBarcodeManual() {
        // if (products.length !== 0) {
        // alert('Data-Selected-orders count = ' + selected.length);
        const chkCount = true;
        // const itemsCount = products.length;
        const now = new Date();
        const nameDownload = now.getDate() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + now.getFullYear()
            + 'T' + now.getHours() + '.' + now.getMinutes();
        const ccc = '';
        const pageSizeset = 'a7';
        // const pageSizeset = 'a4';
        const pageOrientationset = 'landscape';
        // const pageOrientationset = 'portrait';

        // console.log('Count = ' + itemsCount);
        // selected.forEach((r) => {
        //     console.log(r)
        // });

        if (chkCount) {
            pdfMake.fonts = {
                Athiti: {
                    normal: 'Athiti-Light.ttf',
                    bold: 'Athiti-Bold.ttf',
                    italics: 'Athiti-Regular.ttf',
                    bolditalics: 'Athiti-Medium.ttf'
                },
                Sarabun: {
                    normal: 'Sarabun-Regular.ttf',
                    bold: 'Sarabun-Bold.ttf',
                    light: 'Sarabun-Light.ttf',
                    thin: 'Sarabun-Thin.ttf'
                },
                Code128: {
                    normal: 'code128.ttf'
                },
                Ean13: {
                    normal: 'ean13.ttf'
                },
                Fre3of9x: {
                    normal: 'fre3of9x.ttf'
                },
                Free3of9: {
                    normal: 'free3of9.ttf'
                },
                Roboto: {
                    normal: 'Roboto-Regular.ttf',
                    bold: 'Roboto-Medium.ttf',
                    italics: 'Roboto-Italic.ttf',
                    bolditalics: 'Roboto-MediumItalic.ttf'
                }
            };

            pdfMake.vfs = pdfFonts.pdfMake.vfs;
            const contents = [];

            // for loop print PDF //
            // let x = 0;
            // Start selected forEach //
            // this.products.forEach(p => {         // SKIP forEach() //
            // var orderTotal = '';
            // var re = /\n/gi;
            // if ((p.orderRemark !== null) || (p.orderRemark !== '')) {
            //     if (p.orderRemark.search(re) === -1) {
            //         var orderRemarkList = p.orderRemark;
            //     } else {
            //         var orderRemarkList = p.orderRemark.replace('\n', '');
            //     }
            // } else {
            //     var orderRemarkList = p.orderRemark;
            // }
            // var orderShipmentName = '';
            // var orderShipmentList = '';
            // var orderProductList = '';
            // var productMax = 0;
            // var textPage = '';
            // const y = 1;
            // x++;
            // if (p.payment.orderShipmentId !== null) {
            //     this.shipments.filter((rec: Shipment) => {
            //         if (rec.shipmentId === p.payment.orderShipmentId) {
            //             orderShipmentName = rec.shipmentName;
            //         }
            //     });
            // }
            // if (p.orderTotal.toString().length > 3) {
            //     orderTotal += p.orderTotal + '฿';
            // } else {
            //     orderTotal += p.orderTotal + '฿';
            // }

            // if (p.payment.method === 'cod') {
            //     orderShipmentList += orderShipmentName.toLocaleUpperCase()
            //         + '/' + p.payment.method.toLocaleUpperCase() + '/' + orderTotal;
            // }
            // if (p.payment.method === 'banktranfer') {
            //     orderShipmentList += orderShipmentName.toLocaleUpperCase();
            // }
            // if (p.products.length > 0) {
            //     p.products.forEach(r => {
            //         productMax = p.products.length;
            //         if ((y < productMax) && (y !== productMax)) {
            //             orderProductList += (r.code + '(' + r.amount + '), ');
            //         } else {
            //             orderProductList += (r.code + '(' + r.amount + ')');
            //         }
            //         y++;
            //     });
            // }

            // set pageBreak //
            // if ((x < itemsCount)) {
            //     textPage = 'after';
            // } else {
            //     textPage = '';
            // }

            const row_cont =
                [
                    {
                        alignment: 'justify',
                        layout: 'lightHorizontalLines', // optional
                        table: {
                            // headers are automatically repeated if the table spans over multiple pages
                            // you can declare how many rows should be treated as headers
                            headerRows: 1,
                            // headerRows: 1,
                            // widths: [ '*', 'auto', 100, '*' ],
                            // widths: [ '*', 'auto'],
                            body: [
                                {text: ccc, style: 'header'},
                            ]
                        }
                    },
                    // {text: 'Headers', pageBreak: 'before', style: 'header'},
                    // {text: '2 side columns', style: 'header', pageBreak: 'before'},
                    {
                        alignment: 'justify',
                        columns:
                            [
                                {
                                    alignment: 'left',
                                    fontSize: 10,
                                    font: 'Sarabun',
                                    bold: true,
                                    text: 'VD001-C40'
                                },
                                {
                                    text: '*' + 'VD001-C40' + '*',
                                    font: 'Fre3of9x',
                                    fontSize: 20,
                                    alignment: 'right',
                                    border: [false, false, false, false],
                                    margin: [0, 0, 0, 0],
                                }
                            ],
                    },
                    {text: '\n'},
                    {
                        alignment: 'justify',
                        columns:
                            [
                                {
                                    alignment: 'left',
                                    fontSize: 10,
                                    font: 'Sarabun',
                                    bold: true,
                                    text: 'VD001-E40'
                                },
                                {
                                    text: '*' + 'VD001-E40' + '*',
                                    font: 'Fre3of9x',
                                    fontSize: 20,
                                    alignment: 'right',
                                    border: [false, false, false, false],
                                    margin: [0, 0, 0, 0],
                                }
                            ],
                    },
                    {
                        alignment: 'left',
                        font: 'Sarabun',
                        fontSize: 10,
                        bold: true,
                        border: [false, false, false, false],
                        text: 'VD001-C40'
                    },
                    {
                        alignment: 'left',
                        font: 'Sarabun',
                        fontSize: 8,
                        bold: false,
                        border: [false, false, false, false],
                        text: 'VD001-C40'
                    },
                    {
                        style: 'tableExample',
                        table: {
                            widths: ['*', '*'],
                            // widths: [210],
                            // heights: [20, 30, 20],
                            body:
                                [
                                    [
                                        {
                                            text: '*' + 'VD001-C40' + '*',
                                            font: 'Fre3of9x',
                                            fontSize: 30,
                                            alignment: 'center',
                                            border: [false, false, false, false],
                                            margin: [0, 0, 0, 0],
                                            colSpan: 2,
                                        },
                                    ],
                                    [
                                        {
                                            text: 'VD001-C40',
                                            font: 'Sarabun',
                                            fontSize: 8,
                                            bold: true,
                                            border: [false, false, false, false],
                                            colSpan: 2,
                                            margin: [0, -5, 0, 0],
                                            alignment: 'center',
                                        },
                                    ]
                                ]
                        }
                    },
                    // VD001-E40 //
                    {
                        alignment: 'left',
                        font: 'Sarabun',
                        fontSize: 10,
                        bold: true,
                        border: [false, false, false, false],
                        text: 'VD001-E40'
                    },
                    {
                        alignment: 'left',
                        font: 'Sarabun',
                        fontSize: 8,
                        bold: false,
                        border: [false, false, false, false],
                        text: 'VD001-E40'
                    },
                    {
                        style: 'tableExample',
                        table: {
                            widths: ['*', '*'],
                            // widths: [210],
                            // heights: [20, 30, 20],
                            body:
                                [
                                    [
                                        {
                                            text: '*' + 'VD001-E40' + '*',
                                            font: 'Fre3of9x',
                                            fontSize: 30,
                                            alignment: 'center',
                                            border: [false, false, false, false],
                                            margin: [0, 0, 0, 0],
                                            colSpan: 2,
                                        },
                                    ],
                                    [
                                        {
                                            text: 'VD001-E40',
                                            font: 'Sarabun',
                                            fontSize: 8,
                                            bold: true,
                                            border: [false, false, false, false],
                                            colSpan: 2,
                                            margin: [0, -5, 0, 0],
                                            alignment: 'center',
                                        },
                                    ]
                                ]
                        }
                    },
                    // {
                    //     text: ccc,
                    //     style: 'header',
                    //     pageBreak: textPage
                    // }
                    // '\n',
                    // {text: ccc, style: 'header',  'after'}
                ];

            contents.push(row_cont);
            // });   // SKIP forEach() //
            // End selected forEach //

            const dataGen = {
                pageSize: pageSizeset,
                // pageSize: {
                //   width: 210,
                //   height: 298
                // },
                // pageOrientation: 'landscape',
                // pageOrientation: 'portal',
                pageOrientation: pageOrientationset,
                pageMargins: [35, 15, 35, 15],
                content: [contents],
                styles: {
                    header: {
                        font: 'Sarabun',
                        fontSize: 12,
                        alignment: 'justify'
                    },
                    barcodeCode128: {
                        font: 'Code128',
                        fontSize: 50,
                        normal: true,
                        alignment: 'justify'
                    },
                    barcodeEan13: {
                        font: 'Ean13',
                        fontSize: 50,
                        height: 10,
                        normal: true,
                        alignment: 'justify'
                    },
                    Fre3of9x: {
                        font: 'Fre3of9x',
                        fontSize: 50,
                        height: 10,
                        normal: true,
                        alignment: 'justify'
                    },
                    Free3of9: {
                        font: 'Free3of9',
                        fontSize: 40,
                        height: 10,
                        normal: true,
                        alignment: 'justify'
                    },
                    textbarcode: {
                        font: 'Sarabun',
                        fontSize: 12,
                        alignment: 'justify'
                    },
                    spit2left: {
                        alignment: 'left'
                    },
                    spit2right: {
                        alignment: 'right'
                    },
                    tableExample: {
                        margin: [0, 0, 0, 0]
                    },
                    tableHeader: {
                        bold: true,
                        fontSize: 12,
                        color: 'black'
                    }
                },
                defaultStyle: {
                    // columnGap: 10
                }
            };

            // const pdfData = pdfMake.createPdf(dataGen).download('(' + itemsCount + ')barcode_' + nameDownload + '.pdf');
            // pdfMake.createPdf(dataGen).print(pdfData);
            pdfMake.createPdf(dataGen).print();

        }
        // }

    }

    exportProductsToExcel(productsAll) {
        // const selectedOrders = this.orders.filter(o => o.selected);
        this.xlsxService.exportExcelProductsAll(productsAll);
    }
}
