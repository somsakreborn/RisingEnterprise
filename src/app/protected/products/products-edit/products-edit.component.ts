import {Component, OnInit, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import {Product, Historys} from '../products.interface';
import {ProductsService} from '../products.service';
import {Counter} from '../counter.interface';
import {CounterService} from '../counter.service';
import Swal from 'sweetalert2';
import {Location} from '@angular/common';
import {Observable, Subscription} from 'rxjs';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {environment as env} from '../../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';

// add category api //
import {Category} from '../catagory.interface';
import {CategoryService} from '../category.service';
// add warehouse api //
import {WarehousesService} from '../../stocks/warehouses.service';
import {Warehouse} from '../../stocks/warehouses.interface';
// add inventory api //
import {InventoryService} from '../../stocks/inventory.service';
import {Inventory} from '../../stocks/inventory.interface';

declare var $: any;

@Component({
    selector: 'app-products-edit',
    templateUrl: './products-edit.component.html',
    styleUrls: [
        './products-edit.component.scss',
        '../../../../assets/icon/icofont/css/icofont.scss',
    ]
})
export class ProductsEditComponent implements OnInit , OnDestroy {
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

    isCollapsed = true;
    isDetailsCollapsed = true;
    message: string;
    productHistorysLength: any;

    mID: any;
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

    // new by. bamossza
    product: Product = {} as Product;
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
    warehouses: Warehouse[] = [] as Warehouse[];
    inventorys: Inventory[] = [] as Inventory[];
    isReadOnly = true;
    ID: number;
    Name: string;
    checkRole: string;

    resetFileDefault = '';

    collapsed(): void {
        this.message = 'Show';
    }

    expanded(): void {
        this.message = 'Hide';
    }

    constructor(
        private productService: ProductsService,
        private router: Router,
        private location: Location,
        private route: ActivatedRoute,
        private counterService: CounterService,
        private categoryService: CategoryService,
        private warehousesService: WarehousesService,
        private inventoryService: InventoryService
    ) {
        // add script //
        this.route.params.subscribe(params => {
            // console.log(params);
            this.mID = params['id'];
        });
        // add script //

        const today = new Date();
        const dd = today.getDate();
        const mm = today.getMonth() + 1;
        const yyyy = today.getFullYear();

        this.modelPopup.day = dd;
        this.modelPopup.month = mm;
        this.modelPopup.year = yyyy;

    }

    ngOnInit() {
        // this.fetchProduct();
        this.productService.fetchViewProductId(this.mID).subscribe((r) => {
            // this.product = r;
            this.product = r;
            this.product.historys = r.historys.reverse();
            this.productHistorysLength = r.historys.length;
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

        this.fetchCategory();
        // this.fetchWarehouse();
        // this.fetchInventory();
        this.ID = JSON.parse(localStorage.getItem('ID'));
        this.Name = JSON.parse(localStorage.getItem('Name'));
        this.checkRole = JSON.parse(localStorage.getItem('Role'));
    }


    // isFloat($event) { return typeof($event) === 'number' && !Number($event); }
    setTwoNumberDecimal($event) {
        this.value1 = parseFloat(this.value1).toFixed(2);
        // if ((this.value1)) {
        // this.value1 = parseFloat(this.value1).toFixed(2);
        //  return number();
        // }
        // return false;
    }

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
            .subscribe((r: Product[]) => {
                // console.log(r);
                this.products = r;
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

    fetchWarehouse() {
        this.sub = this.warehousesService.fetchWarehouse()
            .subscribe((r: Warehouse[]) => {
                // console.log(r);
                this.warehouses = r;
            });
    }

    fetchInventory() {
        this.sub = this.inventoryService.fetchInventory()
            .subscribe((r: Inventory[]) => {
                // console.log(r);
                this.inventorys = r;
            });
    }

    onSubmit(frm) {
        this.product = frm.value;
        // this.product.productCTId = this.productCTId;
        // alert(JSON.stringify(frm.value));

        // const {year, month, day} = frm.value.productLastupdate;
        // this.product.productRemain = this.product.productTotal;
        this.product.productLastupdate = new Date();

        const formData = new FormData();
        formData.append('file', this.selectedFile);

        // ถ้ามีการแก้ไขรูปภาพใหม่
        if (this.selectedFile) {
            // console.log('Images TRUE =>> ' + this.selectedFile.name);

            this.productService.uploadFile(formData)
                .subscribe(result => {
                    this.product.productImage = result[0].name;
                    this.productService.updateProduct(this.product)
                        .subscribe((r) => {
                            // add historys //
                            const hisName = 'Update';
                            const hisRemark = 'อัพเดทสินค้า';
                            this.pushHistorysDataById(this.product.productId, hisName, hisRemark);
                            // add historys //
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
                    // this.fetchProduct();
                    this.selectedFile = null;
                    this.router.navigate(['/management/products/product']);
                    // this.location.back();
                    // this.modalDefaultView.hide();
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

                            // add historys //
                            const hisName = 'Update';
                            const hisRemark = 'อัพเดทสินค้า';
                            this.pushHistorysDataById(this.product.productId, hisName, hisRemark);
                            // add historys //
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
                    // this.fetchProduct();
                    this.selectedFile = null;
                    this.router.navigate(['/management/products/product']);
                    // this.location.back();
                    // this.modalDefaultView.hide();
                    // this.modalDefaultWizardView.hide();
                });
        }
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

    resetFile(state?: string) {
        this.imageUrl = state === 'add' ? this.imageUrlBlank : '';
        this.resetFileDefault = '';
    }

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

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    //  Types of property 'position' are incompatible. //
    //  Type 'string' is not assignable to type //
    //  '"center" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-st...'. //
    public alertWarningPosition(val: string, positions) {
        const toast = Swal.mixin({
            toast: true,
            position: positions,
            showConfirmButton: false,
            timer: 8000
        });
        toast({
            type: 'warning',
            title: val
        });
    }

    public alertSuccessPosition(val: string, positions) {
        const toast = Swal.mixin({
            toast: true,
            position: positions,
            showConfirmButton: false,
            timer: 8000
        });
        toast({
            type: 'success',
            title: val
        });
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

    public pushHistorysDataById(id, hisName, hisRemark) {
        // if (this.checkRoleData()) {
        // this.alertSuccess(`คุณมีสิทธื์ใช้งาน เพื่อเข้าถึงข้อมูลนี้ได้`);

        this.productService.fetchViewProductId(id).subscribe((r: Product) => {
            this.product = r;
            this.product.historys.push({
                hisName: hisName,
                hisRemark: hisRemark,
                sellerId: this.ID,
                sellerName: this.Name,
                lastUpdate: new Date()
            });

            this.productService.updateProduct(this.product).subscribe((m: Product) => {
                return true;
            });
        });
        // } else {
        //     return this.alertWarning(`คุณไม่มีสิทธื์เข้าถึงข้อมูลนี้ กรุณาตรวจสอบอีกครั้ง!`);
        // }
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
}
