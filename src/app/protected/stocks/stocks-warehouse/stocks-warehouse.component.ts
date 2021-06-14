import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {Warehouse} from '../warehouses.interface';
import {WarehousesService} from '../warehouses.service';
import Swal from 'sweetalert2';
import {environment as env} from '../../../../environments/environment';

import {UiSwitchModule} from 'ng2-ui-switch';

import {ProductsService} from '../../products/products.service';
import {Product} from '../../products/products.interface';

declare var $: any;

import * as moment from 'moment';
// import 'moment/locale/pt-br';
// let now = moment().format('LLLL');
@Component({
    selector: 'app-stocks-warehouse',
    templateUrl: './stocks-warehouse.component.html',
    styleUrls: [
        './stocks-warehouse.component.scss',
        '../../../../assets/icon/icofont/css/icofont.scss'
    ]
})

export class StocksWarehouseComponent implements OnInit, OnDestroy {

// ViewChild
    @ViewChild('modalDefault') modalDefaultView;
    @ViewChild('modalDefaultWizard') modalDefaultWizardView;
    @ViewChild('warehouseFormModal') warehouseFormModal;
    @Input('modalDefault') modalDefault: any;
    @Input('modalDefaultWizard') modalDefaultWizard: any;
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
    times: number = Date.now();
    modelPopup: NgbDateStruct = {} as NgbDateStruct;

    modelPopupWarehouseLastupdate: NgbDateStruct;
    modelPopupWarehouseCreated: NgbDateStruct;

    public date: { year: number, month: number, day: number };
    public fullDate: { year: number, month: number, day: number, timefull: any };

    selectedFile = null;
    showImg = '';

    warehouse: Warehouse = {} as Warehouse;
    product: Product = {} as Product;
    warehouseCache = '';

    value1 = '';

    warehouses: Warehouse[] = [] as Warehouse[];
    isReadOnly = true;

    resetFileDefault = '';

    constructor(
        private warehouseService: WarehousesService,
        private productService: ProductsService
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
        this.fetchWarehouse();

        // test moment Log //
        // console.log(moment('2018-08-10').format('LLLL'));
        // console.log(moment('2018-08-10').fromNow());
        // console.log(moment().fromNow());
        // console.log(moment().format('LTS'));
    }


    // isFloat($event) { return typeof($event) === 'number' && !Number($event); }
    setTwoNumberDecimal($event) {
        //this.value1 = parseFloat(this.value1).toFixed(2);
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

    fetchWarehouse() {
        // Test Moment  show Time Diff//
        // let now = moment().format('LLLL');
        // console.log(moment([2018, 9, 5, 12:48 ]).toNow());

        this.sub = this.warehouseService.fetchWarehouse()
            // .map((m: Warehouse[]) => {
            //     let x = 0;
            //     m.map(r => {
            //         r.index = ++x;
            //         if (r.warehouseImage) {
            //             r.warehouseImage = `${env.serverAPI}/images/warehouse/` + r.warehouseImage;
            //         } else {
            //             r.warehouseImage = `${env.serverAPI}/images/image-blank.jpg`;
            //         }
            //
            //         if (r.warehouseLastupdate) {
            //             const dd = r.warehouseLastupdate.toString().split('T');
            //             const ddConv = dd[0].split('-');
            //             r.warehouseLastupdate = ddConv[2] + '-' + ddConv[1] + '-' + ddConv[0];
            //         }
            //         return r;
            //     });
            //     return m;
            // })
            // .subscribe((r: Warehouse[]) => this.warehouses = r);
            .subscribe((r: Warehouse[]) => {
                let x = 0;
                r.map(r => {
                    r.index = ++x;
                    return r;
                })
                // console.log(r);
                this.warehouses = r;
            });
    }


    // test moment function //
    // testMoment(mm){
    //     let now = moment().format('LLLL');
    //      // console.log(moment(mm).toNow());
    //      return moment(mm).toNow();
    // }

    // test moment function //
    // testMomentTime() {
    //     // let now = moment().format('LLLL');
    //      // console.log(moment(mm).toNow());
    //      return moment().format('LTS');
    // }

    onSubmit(frm) {

        this.warehouse = frm.value;
        // this.warehouse.warehouseCTId = this.warehouseCTId;
        // alert(JSON.stringify(frm.value));

        const {year, month, day} = frm.value.warehouseLastupdate;
        // const fullDate = frm.value.warehouseLastupdate;
        // const times: any = this.times;
        this.warehouse.warehouseLastupdate = new Date(year, month - 1, day);
        // this.warehouse.warehouseLastupdate = this.times;
        // this.warehouse.warehouseLastupdate = new Date(this.times);

        const formData = new FormData();
        formData.append('file', this.selectedFile);

        // if ((frm.value.warehouseImage === '') || (frm.value.warehouseImage === null)) {
            // console.log('*-- undefined --*');

            this.warehouseService.addWarehouse(this.warehouse)
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
                    this.fetchWarehouse();
                    this.selectedFile = null;
                    // this.warehouseFormModal.close('warehouseModal');
                    this.modalDefaultWizardView.hide();
                    // this.warehouseFormModal.close('modalDefaultWizard');
                });

        // } else {
        //     // console.log('--not undefined--');
        //     this.warehouseService.uploadFile(formData)
        //         .subscribe(result => {
        //             this.warehouse.warehouseImage = result[0].name;
        //             this.warehouseService.addWarehouse(this.warehouse)
        //                 .subscribe(() => {
        //                     Swal({
        //                         position: 'center',
        //                         type: 'success',
        //                         title: 'เพิ่มข้อมูลสาขา เรียบร้อยแล้ว',
        //                         showConfirmButton: false,
        //                         timer: 1200
        //                     });
        //                     this.fetchWarehouse();
        //                     this.selectedFile = null;
        //                     // this.warehouseFormModal.close('warehouseModal');
        //                     // this.modalDefaultWizardView.hide();
        //                     this.modalDefaultWizardView.hide();
        //                 });
        //         });
        // }
        this.fetchWarehouse();
    }

    viewWarehouse(warehouse: Warehouse) {
        // this.warehouseService.fetchViewWarehouse(warehouse).subscribe((r) => this.warehouse = r);
        this.warehouseService.fetchViewWarehouse(warehouse).map((m) => {

            m.warehouseLastupdate = new Date(m.warehouseLastupdate);
            m.warehouseCreated = new Date(m.warehouseCreated);

            const ddStart = new Date(m.warehouseLastupdate);
            this.modelPopupWarehouseLastupdate = {year: ddStart.getFullYear(), month: ddStart.getMonth() + 1, day: ddStart.getDate()};

            const ddCreate = new Date(m.warehouseCreated);
            this.modelPopupWarehouseCreated = {year: ddCreate.getFullYear(), month: ddCreate.getMonth() + 1, day: ddCreate.getDate()};

            return m;

        }).subscribe((r) => {

            this.warehouse = r;
            // if (r.warehouseImage) {
            //     r.warehouseImage = `${env.serverAPI}/images/warehouse/` + r.warehouseImage;
            //     this.showImg = r.warehouseImage;
            //     this.warehouseCache = r.warehouseImage;
            // } else {
            //     r.warehouseImage = `${env.serverAPI}/images/image-blank.jpg`;
            //     this.showImg = r.warehouseImage;
            //     this.warehouseCache = r.warehouseImage;
            // }

        });
        this.isReadOnly = true;
    }

    editWarehouse(warehouse: Warehouse) {
        this.warehouseService.fetchViewWarehouse(warehouse).map((m) => {

            m.warehouseLastupdate = new Date(m.warehouseLastupdate);
            m.warehouseCreated = new Date(m.warehouseCreated);

            const ddStart = new Date(m.warehouseLastupdate);
            this.modelPopupWarehouseLastupdate = {year: ddStart.getFullYear(), month: ddStart.getMonth() + 1, day: ddStart.getDate()};

            const ddCreate = new Date(m.warehouseCreated);
            this.modelPopupWarehouseCreated = {year: ddCreate.getFullYear(), month: ddCreate.getMonth() + 1, day: ddCreate.getDate()};

            return m;

        }).subscribe((r) => {

            this.warehouse = r;
            // if (r.warehouseImage) {
            //     r.warehouseImage = `${env.serverAPI}/images/warehouse/` + r.warehouseImage;
            //     this.showImg = r.warehouseImage;
            //     this.warehouseCache = r.warehouseImage;
            // } else {
            //     r.warehouseImage = `${env.serverAPI}/images/image-blank.jpg`;
            //     this.showImg = r.warehouseImage;
            //     this.warehouseCache = r.warehouseImage;
            // }
        });
        this.isReadOnly = false;
    }

    resetFile(state?: string) {
        this.imageUrl = state === 'add' ? this.imageUrlBlank : '';
        this.resetFileDefault = '';
    }

    updateWarehouse(frm) {
        // this.warehouse = frm.value;
        // alert(JSON.stringify(frm.value));

        const formData = new FormData();
        formData.append('file', this.selectedFile);

        this.warehouse.warehouseName = frm.value.warehouseName;
        this.warehouse.warehouseComment = frm.value.warehouseComment;
        const {year, month, day} = frm.value.warehouseLastupdate;
        this.warehouse.warehouseLastupdate = new Date(year, month - 1, day);
        // const {year, month, day} = frm.value.warehouseCreated;
        // this.warehouse.warehouseCreated = new Date(year, month - 1, day);

        // this.warehouse.warehouseImage = frm.value.warehouseImage;

        // ถ้ามีการแก้ไขรูปภาพใหม่
        // if (this.selectedFile) {
        //     // console.log('Images TRUE =>> ' + this.selectedFile.name);
        //     this.warehouseService.uploadFile(formData)
        //         .subscribe(result => {
        //             this.warehouse.warehouseImage = result[0].name;
        //             this.warehouseService.updateWarehouse(this.warehouse)
        //                 .subscribe((r) => {
        //                     Swal({
        //                         position: 'center',
        //                         type: 'success',
        //                         title: 'แก้ไขข้อมูลพนักงาน เรียบร้อยแล้ว',
        //                         // title: 'Your work has been saved',
        //                         showConfirmButton: false,
        //                         timer: 1200
        //                     });
        //                 });
        //             this.fetchWarehouse();
        //             this.selectedFile = null;
        //             this.modalDefaultView.hide();
        //             // this.modalDefaultWizardView.hide();
        //         });
        //
        // } else {
            this.warehouseService.fetchViewWarehouse(this.warehouse)
                .subscribe(result => {
                    // this.warehouse.warehouseImage = result.warehouseImage;
                    this.warehouseService.updateWarehouse(this.warehouse)
                        .subscribe((r) => {
                            // console.log(result.warehouseImage);
                            // alert(this.warehouse.warehouseImage);
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
                    this.fetchWarehouse();
                    this.selectedFile = null;
                    this.modalDefaultView.hide();
                    // this.modalDefaultWizardView.hide();
                });
        // }
        this.fetchWarehouse();
    }

    deleteWarehouse(warehouse: Warehouse) {
        // console.log(JSON.stringify(warehouse));
        // console.log(warehouse.warehouseId);
        // check productwarehouseId be for delete database is Null no Use in product //
        // this.product.warehouseId = warehouse.warehouseId;
        // this.productService.fetchViewProductWarehouse(this.product)
        //     .subscribe(result => {
        //         // if (result => 1) {
        //         if (result) {
        //             console.log(result);
        //             //return result;
        //
        //         } else {
        //             console.log(result);
        //         }
        //         // return result;
        //         // console.log(result);
        //     });

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
                this.warehouseService.deleteWarehouse(warehouse)
                    .subscribe((r) => {
                        // this.data = this.warehouseService.fetchWarehouse();
                        this.fetchWarehouse();
                    });
            }
        });
    }

    // handleFileInputEdit(file: FileList) {
    //     const formData = new FormData();
    //     formData.append('file', file.item(0));
    //     this.selectedFile = file.item(0);
    //
    //     this.fileToUpload = file.item(0);
    //
    //     const reader = new FileReader();
    //     if (this.fileToUpload) {
    //         reader.onload = (event: any) => {
    //             // this.imageUrl = event.target.result;
    //             this.warehouse.warehouseImage = event.target.result;
    //             this.showImg = event.target.result;
    //         };
    //         reader.readAsDataURL(this.fileToUpload);
    //     } else {
    //         // ไม่เลือกรูปภาพ  ให้โชว์ภาพว่างๆ
    //         this.showImg = this.warehouseCache;
    //         this.warehouse.warehouseImage = this.warehouseCache;
    //     }
    // }
    //
    // handleFileInputAdd(file: FileList) {
    //     const formData = new FormData();
    //     formData.append('file', file.item(0));
    //     this.selectedFile = file.item(0);
    //     this.fileToUpload = file.item(0);
    //
    //     const reader = new FileReader();
    //     if (this.fileToUpload) {
    //         reader.onload = (event: any) => {
    //             this.imageUrl = event.target.result;
    //         };
    //         reader.readAsDataURL(this.fileToUpload);
    //     } else {
    //         // ไม่เลือกรูปภาพ  ให้โชว์ภาพว่างๆ
    //         this.imageUrl = this.imageUrlBlank;
    //     }
    // }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

}
