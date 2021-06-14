import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import 'rxjs/add/observable/of';
import {Shipment} from '../shipments.interface';
import {ShipmentService} from '../shipments.service';
import Swal from 'sweetalert2';
import {Subscription} from 'rxjs';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {environment as env} from '../../../../environments/environment';

declare var $: any;

@Component({
    selector: 'app-shipments-detail',
    templateUrl: './shipments-detail.component.html',
    styleUrls: ['./shipments-detail.component.scss',
        '../../../../assets/icon/icofont/css/icofont.scss'
    ]
})

export class ShipmentsDetailComponent implements OnInit, OnDestroy {

// ViewChild
    @ViewChild('modalDefault') modalDefaultView;
    @ViewChild('shipmentFormModal') shipmentFormModal;
    @Input('modalDefault') modalDefault: any;
    @ViewChild('Image') Image: ElementRef;

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

    modelPopupShipmentStartDate: NgbDateStruct;
    modelPopupShipmentCreated: NgbDateStruct;

    public date: { year: number, month: number, day: number };

    selectedFile = null;
    showImg = '';

    // new by. bamossza
    shipment: Shipment = {} as Shipment;
    shipmentCache = '';

    // shipment ===> {  . . ..  .. }

    shipments: Shipment[] = [] as Shipment[];

    isReadOnly = true;

    resetFileDefault = '';

    constructor(
        private shipmentService: ShipmentService
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
        this.fetchShipment();
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
            });
    }

    onSubmit(frm) {

        this.shipment = frm.value;
        // alert(JSON.stringify(frm.value));

        const {year, month, day} = frm.value.shipmentStartDate;
        this.shipment.shipmentStartDate = new Date(year, month - 1, day);

        // console.log(this.shipment);
        // alert(this.shipment.shipmentStartDate.toJSON());
        // alert(this.shipment.shipmentStartDate.toDateString());
        // alert(this.shipment.shipmentStartDate.toISOString());
        const formData = new FormData();
        formData.append('file', this.selectedFile);

        if ((frm.value.shipmentImage === '') || (frm.value.shipmentImage === null)) {
            // console.log('*-- undefined --*');
            this.shipmentService.addShipment(this.shipment)
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
                    this.fetchShipment();
                    this.selectedFile = null;
                    this.shipmentFormModal.close('shipmentModal');
                });

        } else {
            // console.log('--not undefined--');
            this.shipmentService.uploadFile(formData)
                .subscribe(result => {
                    this.shipment.shipmentImage = result[0].name;
                    this.shipmentService.addShipment(this.shipment)
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
                            this.fetchShipment();
                            this.selectedFile = null;
                            this.shipmentFormModal.close('shipmentModal');
                        });
                });
        }
        this.fetchShipment();
    }

    viewShipment(shipment: Shipment) {
        // this.shipmentService.fetchViewShipment(shipment).subscribe((r) => this.shipment = r);
        this.shipmentService.fetchViewShipment(shipment).map((m) => {

            m.shipmentStartDate = new Date(m.shipmentStartDate);
            m.shipmentCreated = new Date(m.shipmentCreated);

            const ddStart = new Date(m.shipmentStartDate);
            this.modelPopupShipmentStartDate = {year: ddStart.getFullYear(), month: ddStart.getMonth() + 1, day: ddStart.getDate()};

            const ddCreate = new Date(m.shipmentCreated);
            this.modelPopupShipmentCreated = {year: ddCreate.getFullYear(), month: ddCreate.getMonth() + 1, day: ddCreate.getDate()};

            return m;

        }).subscribe((r) => {

            this.shipment = r;
            if (r.shipmentImage) {
                r.shipmentImage = `${env.serverAPI}/images/shipment/` + r.shipmentImage;
                this.showImg = r.shipmentImage;
                this.shipmentCache = r.shipmentImage;
            } else {
                r.shipmentImage = `${env.serverAPI}/images/image-blank.jpg`;
                this.showImg = r.shipmentImage;
                this.shipmentCache = r.shipmentImage;
            }

        });
        this.isReadOnly = true;
    }

    editShipment(shipment: Shipment) {
        this.shipmentService.fetchViewShipment(shipment).map((m) => {

            m.shipmentStartDate = new Date(m.shipmentStartDate);
            m.shipmentCreated = new Date(m.shipmentCreated);

            const ddStart = new Date(m.shipmentStartDate);
            this.modelPopupShipmentStartDate = {year: ddStart.getFullYear(), month: ddStart.getMonth() + 1, day: ddStart.getDate()};

            const ddCreate = new Date(m.shipmentCreated);
            this.modelPopupShipmentCreated = {year: ddCreate.getFullYear(), month: ddCreate.getMonth() + 1, day: ddCreate.getDate()};

            return m;

        }).subscribe((r) => {

            this.shipment = r;
            if (r.shipmentImage) {
                r.shipmentImage = `${env.serverAPI}/images/shipment/` + r.shipmentImage;
                this.showImg = r.shipmentImage;
                this.shipmentCache = r.shipmentImage;
            } else {
                r.shipmentImage = `${env.serverAPI}/images/image-blank.jpg`;
                this.showImg = r.shipmentImage;
                this.shipmentCache = r.shipmentImage;
            }
        });
        this.isReadOnly = false;
    }

    resetFile(state?: string) {
        this.imageUrl = state === 'add' ? this.imageUrlBlank : '';
        this.resetFileDefault = '';
    }

    updateShipment(frm) {
        // this.shipment = frm.value;
        const formData = new FormData();
        formData.append('file', this.selectedFile);

        this.shipment.shipmentName = frm.value.shipmentName;
        this.shipment.shipmentComment = frm.value.shipmentComment;
        const {year, month, day} = frm.value.shipmentStartDate;
        this.shipment.shipmentStartDate = new Date(year, month - 1, day);
        // const {year, month, day} = frm.value.shipmentCreated;
        // this.shipment.shipmentCreated = new Date(year, month - 1, day);

        // this.shipment.shipmentImage = frm.value.shipmentImage;

        // ถ้ามีการแก้ไขรูปภาพใหม่
        if (this.selectedFile) {
            // console.log('Images TRUE =>> ' + this.selectedFile.name);
            this.shipmentService.uploadFile(formData)
                .subscribe(result => {
                    this.shipment.shipmentImage = result[0].name;
                    this.shipmentService.updateShipment(this.shipment)
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
                    this.fetchShipment();
                    this.selectedFile = null;
                    this.modalDefaultView.hide();
                });

        } else {
            this.shipmentService.fetchViewShipment(this.shipment)
                .subscribe(result => {
                    this.shipment.shipmentImage = result.shipmentImage;
                    this.shipmentService.updateShipment(this.shipment)
                        .subscribe((r) => {
                            // console.log(result.shipmentImage);
                            // alert(this.shipment.shipmentImage);
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
                    this.fetchShipment();
                    this.selectedFile = null;
                    this.modalDefaultView.hide();
                });
        }
    }

    deleteShipment(shipment: Shipment) {
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
                this.shipmentService.deleteShipment(shipment)
                    .subscribe((r) => {
                        // this.data = this.shipmentService.fetchShipment();
                        this.fetchShipment();
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
                this.shipment.shipmentImage = event.target.result;
                this.showImg = event.target.result;
            };
            reader.readAsDataURL(this.fileToUpload);
        } else {
            // ไม่เลือกรูปภาพ  ให้โชว์ภาพว่างๆ
            this.showImg = this.shipmentCache;
            this.shipment.shipmentImage = this.shipmentCache;
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

}

