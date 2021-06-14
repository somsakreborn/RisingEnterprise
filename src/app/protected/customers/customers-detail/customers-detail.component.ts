import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
// import {animate, style, transition, trigger} from '@angular/animations';
import {Subscription} from 'rxjs';
import {environment as env} from '../../../../environments/environment';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {Customer} from '../customers.interface';
import {CustomersService} from '../customers.service';
import {Router} from '@angular/router';

// import API Channel Data //
import {Channel} from '../../channels/channels.interface';
import {ChannelsService} from '../../channels/channels.service';

declare var $: any;
import {XlsxService} from '../../../services/xlsx.service';

@Component({
  selector: 'app-customers-detail',
  templateUrl: './customers-detail.component.html',
  styleUrls: [
      './customers-detail.component.scss',
      '../../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class CustomersDetailComponent implements OnInit, OnDestroy {
// ViewChild
    @ViewChild('modalDefault') modalDefaultView;
    @ViewChild('customerFormModal') customerFormModal;
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

    modelPopupCustomerStartDate: NgbDateStruct;
    modelPopupCustomerCreated: NgbDateStruct;

    public date: { year: number, month: number, day: number };

    selectedFile = null;
    showImg = '';

    customer: Customer = {} as Customer;

    customerCache = '';

    channels: Channel[] = [] as Channel[];
    customers: Customer[] = [] as Customer[];

    isReadOnly = true;

    resetFileDefault = '';

    itemsLevel: any = [
        {id: 1, disabled: true, level: 'admin'},
        {id: 2, disabled: false, level: 'customer'},
        {id: 3, disabled: false, level: 'normal'},
        {id: 4, disabled: false, level: 'other'}
    ];

    constructor(
        private customerService: CustomersService,
        private channelService: ChannelsService,
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
        this.fetchCustomer();
        this.fetchChannel();
        // console.log(this.fetchCustomer);

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

    fetchCustomer() {
        this.sub = this.customerService.fetchCustomer()
            .map((m: Customer[]) => {
                let x = 0;
                m.map(r => {
                    r.index = ++x;
                    // if (r.customerImage) {
                    //     r.customerImage = `${env.serverAPI}/images/customer/` + r.customerImage;
                    // } else {
                    //     r.customerImage = `${env.serverAPI}/images/image-blank.jpg`;
                    // }

                    if (r.customerLastupdate) {
                        const dd = r.customerLastupdate.toString().split('T');
                        const ddConv = dd[0].split('-');
                        r.customerLastupdate = ddConv[2]  + '-' + ddConv[1] + '-' + ddConv[0];
                    }
                    return r;
                });
                return m;
            })
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
            });
    }

    onSubmit(frm) {

        this.customer = frm.value;
        // alert(JSON.stringify(frm.value));
        // if (this.customer.customerPassword === this.customer.confirmPassword  {
        //     alert(this.customer.customerPassword + ' - ' + this.customer.confirmPassword);
        // } else {
        //     alert('No-Password');
        // }

        const {year, month, day} = frm.value.customerLastlogin;
        this.customer.customerLastupdate = new Date(year, month - 1, day);

        const formData = new FormData();
        formData.append('file', this.selectedFile);

        // if (this.customer.customerPassword === this.customer.confirmPassword && this.customer.customerPassword != null && this.customer.customerPassword.length >= 4
        //     && this.customer.customerLevel !== (null && undefined)) {
        //     // alert(this.customer.customerPassword + ' -- ' + this.customer.confirmPassword);
        //
        //     if ((frm.value.customerImage === '') || (frm.value.customerImage === null)) {
                // console.log('*-- undefined --*');
                this.customerService.addCustomer(this.customer)
                    .subscribe(() => {
                        Swal({
                            position: 'center',
                            type: 'success',
                            title: 'เพิ่มข้อมูลสาขา เรียบร้อยแล้ว',
                            showConfirmButton: false,
                            timer: 1200
                        });
                        this.fetchCustomer();
                        this.selectedFile = null;
                        this.customerFormModal.close('customerModal');
                    });

            // } else {
            //     // console.log('--not undefined--');
            //     this.customerService.uploadFile(formData)
            //         .subscribe(result => {
            //             this.customer.customerImage = result[0].name;
            //             this.customerService.addCustomer(this.customer)
            //                 .subscribe(() => {
            //                     Swal({
            //                         position: 'center',
            //                         type: 'success',
            //                         title: 'เพิ่มข้อมูลสาขา เรียบร้อยแล้ว',
            //                         showConfirmButton: false,
            //                         timer: 1200
            //                     });
            //                     this.fetchCustomer();
            //                     this.selectedFile = null;
            //                     this.customerFormModal.close('customerModal');
            //                 });
            //         });
            // }

        // } else {
        //     // alert(this.customer.customerPassword + ' XXXX ' + this.customer.confirmPassword);
        //     this.customerFormModal.close('customerModal');
        //     Swal({
        //         type: 'error',
        //         title: 'ข้อมูลผิดพลาด',
        //         text: 'คุณกรอกข้อมูลไม่ถูกต้อง',
        //         // footer: '<a href>Why do I have this issue?</a>'
        //     });
        //     return false;
        // }
        this.fetchCustomer();
    }

    viewCustomer(customer: Customer) {
        // this.customerService.fetchViewCustomer(customer).subscribe((r) => this.customer = r);
        this.customerService.fetchViewCustomer(customer).map((m) => {

            m.customerLastupdate = new Date(m.customerLastupdate);
            m.customerCreated = new Date(m.customerCreated);

            const ddStart = new Date(m.customerLastupdate);
            this.modelPopupCustomerStartDate = {year: ddStart.getFullYear(), month: ddStart.getMonth() + 1, day: ddStart.getDate()};

            const ddCreate = new Date(m.customerCreated);
            this.modelPopupCustomerCreated = {year: ddCreate.getFullYear(), month: ddCreate.getMonth() + 1, day: ddCreate.getDate()};

            return m;

        }).subscribe((r) => {

            this.customer = r;
            // if (r.customerImage) {
            //     r.customerImage = `${env.serverAPI}/images/customer/` + r.customerImage;
            //     this.showImg = r.customerImage;
            //     // this.customerCache = r.customerImage;
            // } else {
            //     r.customerImage = `${env.serverAPI}/images/image-blank.jpg`;
            //     this.showImg = r.customerImage;
            //     // this.customerCache = r.customerImage;
            // }

        });
        this.isReadOnly = true;
    }

    editCustomerId(id) {
        // alert(id);
        // this.router.navigate(['/management/customers/customers-edit/' + id + '/mode/edit']);
        this.router.navigate(['/management/customers/customers-edit/' + id ]);
    }

    editCustomer(customer: Customer) {
        this.customerService.fetchViewCustomer(customer).map((m) => {

            m.customerLastupdate = new Date(m.customerLastupdate);
            m.customerCreated = new Date(m.customerCreated);

            const ddStart = new Date(m.customerLastupdate);
            this.modelPopupCustomerStartDate = {year: ddStart.getFullYear(), month: ddStart.getMonth() + 1, day: ddStart.getDate()};

            const ddCreate = new Date(m.customerCreated);
            this.modelPopupCustomerCreated = {year: ddCreate.getFullYear(), month: ddCreate.getMonth() + 1, day: ddCreate.getDate()};

            return m;

        }).subscribe((r) => {

            this.customer = r;
            // if (r.customerImage) {
            //     r.customerImage = `${env.serverAPI}/images/customer/` + r.customerImage;
            //     this.showImg = r.customerImage;
            //     // this.customerCache = r.customerImage;
            // } else {
            //     r.customerImage = `${env.serverAPI}/images/image-blank.jpg`;
            //     this.showImg = r.customerImage;
            //     // this.customerCache = r.customerImage;
            // }
        });
        this.isReadOnly = false;
    }

    resetFile(state?: string) {
        this.imageUrl = state === 'add' ? this.imageUrlBlank : '';
        this.resetFileDefault = '';
    }

    updateCustomer(frm) {
        // this.customer = frm.value;
        const formData = new FormData();
        formData.append('file', this.selectedFile);

        this.customer.customerNameSurname = frm.value.customerNameSurname;
        this.customer.customerEmail = frm.value.customerEmail;
        this.customer.customerTel = frm.value.customerTel;
        const {year, month, day} = frm.value.customerLastupdate;
        this.customer.customerLastupdate = new Date(year, month - 1, day);
        // const {year, month, day} = frm.value.customerCreated;
        // this.customer.customerCreated = new Date(year, month - 1, day);

        // this.customer.customerImage = frm.value.customerImage;

        // ถ้ามีการแก้ไขรูปภาพใหม่
        if (this.selectedFile) {
            // console.log('Images TRUE =>> ' + this.selectedFile.name);
            this.customerService.uploadFile(formData)
                .subscribe(result => {
                    // this.customer.customerImage = result[0].name;
                    this.customerService.updateCustomer(this.customer)
                        .subscribe((r) => {
                            Swal({
                                position: 'center',
                                type: 'success',
                                title: 'แก้ไขข้อมูลพนักงาน เรียบร้อยแล้ว',
                                // title: 'Your work has been saved',
                                showConfirmButton: false,
                                timer: 1200
                            });
                        });
                    this.fetchCustomer();
                    this.selectedFile = null;
                    this.modalDefaultView.hide();
                });

        } else {
            this.customerService.fetchViewCustomer(this.customer)
                .subscribe(result => {
                    // this.customer.customerImage = result.customerImage;
                    this.customerService.updateCustomer(this.customer)
                        .subscribe((r) => {
                            // console.log(result.customerImage);
                            // alert(this.customer.customerImage);
                            Swal({
                                position: 'center',
                                type: 'success',
                                title: 'แก้ไขข้อมูลพนักงาน เรียบร้อยแล้ว',
                                // title: 'Your work has been saved',
                                showConfirmButton: false,
                                timer: 1200
                            });
                        });
                    this.fetchCustomer();
                    this.selectedFile = null;
                    this.modalDefaultView.hide();
                });
        }
    }

    async deleteCustomer(customer: Customer) {

        Swal({
            // title: 'Are you sure?',
            // text: "You won't be able to revert this!",
            title: '\nคุณต้องการที่จะลบข้อมูล ใช่ไหม?',
            text: '\nคุณจะไม่สามารถย้อนกลับได้!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ใช่, ฉันต้องการ',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.value) {
                this.customerService.deleteCustomer(customer)
                    .subscribe((r) => {
                        // this.data = this.customerService.fetchCustomer();
                        this.fetchCustomer();
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
                // this.customer.customerImage = event.target.result;
                this.showImg = event.target.result;
            };
            reader.readAsDataURL(this.fileToUpload);
        } else {
            // ไม่เลือกรูปภาพ  ให้โชว์ภาพว่างๆ
            // this.customer.customerImage = this.customerCache;
            this.showImg = this.customerCache;
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

    exportCustomersAllToExcel(customers) {
        // const selectedOrders = this.orders.filter(o => o.selected);
        // console.log('channel = ' + JSON.stringify(this.channels));
        // console.log('shipment = ' + JSON.stringify(this.shipments));
        this.xlsxService.exportExcelCustomersAll(customers, this.channels);
    }

    // rows = [];
    // selected = [];
    //
    // constructor() {
    //     this.fetch((data) => {
    //         this.rows = data;
    //     });
    // }
    //
    // ngOnInit() {
    // }
    //
    // fetch(cb) {
    //     const req = new XMLHttpRequest();
    //     req.open('GET', `assets/data/company.json`);
    //
    //     req.onload = () => {
    //         cb(JSON.parse(req.response));
    //     };
    //
    //     req.send();
    // }
    //
    // onSelect({ selected }) {
    //     this.selected.splice(0, this.selected.length);
    //     this.selected.push(...selected);
    // }
    //
    // onActivate(event) {}
    //
    // add() {
    //     this.selected.push(this.rows[1], this.rows[3]);
    // }
    //
    // update() {
    //     this.selected = [this.rows[1], this.rows[3]];
    // }
    //
    // remove() {
    //     this.selected = [];
    // }

}
