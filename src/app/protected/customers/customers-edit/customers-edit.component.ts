import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import Swal from 'sweetalert2';
import {Customer} from '../customers.interface';
import {CustomersService} from '../customers.service';
import {environment as env} from '../../../../environments/environment';

import 'rxjs/add/observable/of';
import {IOption} from 'ng-select';
import {Subscription} from 'rxjs/Subscription';
import {SelectOptionService} from '../../../shared/elements/select-option.service';

declare var $: any;

import '../../../../assets/jquery.ddslick.min';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

// import API Channel Data //
import {Channel} from '../../channels/channels.interface';
import {ChannelsService} from '../../channels/channels.service';


@Component({
  selector: 'app-customers-edit',
  templateUrl: './customers-edit.component.html',
  styleUrls: ['./customers-edit.component.scss']
})
export class CustomersEditComponent implements OnInit, OnDestroy {

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

    modelPopupShipmentStartDate: NgbDateStruct;
    modelPopupShipmentCreated: NgbDateStruct;

    public date: { year: number, month: number, day: number };
    customer: Customer = {} as Customer;
    channel: Channel = {} as Channel;
    customerCache = '';

    // customer ===> {  . . ..  .. }
    customers: Customer[] = [] as Customer[];
    channels: Channel[] = [] as Channel[];

    // const data1: string = [];
    simpleOption: Array<IOption> = this.selectOptionService.getCharacters();
    selectedOption = '3';
    isDisabled = true;
    // characters: Array<IOption>;
    characters: Array<IOption> = this.selectOptionService.getCharacters();
    msg: string;
    myOptionData = 'LU';
    myOptions: Array<IOption> = [
        {label: 'Belgium', value: 'BE'},
        {label: 'Luxembourg', value: 'LU'},
        {label: 'Netherlands', value: 'NL'}
    ];
    selectedCharacter = '3';
    timeLeft = 5;

    private dataSub: Subscription = null;

    // selectedCountries: Array<string> = ['IN', 'BE', 'LU', 'NL'];
    selectedCountries: Array<string> = ['TH', 'US'];
    countries: Array<IOption> = this.selectOptionService.getCountries();
    selectedCountry = 'TH';

    constructor(
        private customerService: CustomersService,
        private channelService: ChannelsService,
        private router: Router,
        private location: Location,
        private route: ActivatedRoute,
        public selectOptionService: SelectOptionService
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
        this.customerService.fetchViewCustomerId(this.mID).subscribe((r) => {
            this.customer = r;
        });
        // this.fetchCustomer();
        this.fetchChannel();

        this.runTimer();
        this.dataSub = this.selectOptionService.loadCharacters().subscribe((options) => {
            this.characters = options;
        });

        //  test data select image jquerry  //
        $('#options').ddslick(
            {
                // data: ddData,
                width: 200,
                height: 200,
                imagePosition: 'right',
                selectText: 'Select your favorite social network',
                onSelected: function (data) {
                    // console.log(data);
                }
            }
        );

        $('#demo-htmlselect').ddslick({
            width: 250,
            height: 50,
            imagePosition: 'left',
            onSelected: function(Data) {
                // callback function: do something with selectedData;
            }
        });

        $('#customerSocial').ddslick({
            width: 250,
            height: 80,
            imagePosition: 'left',
            onSelected: function(Data) {
                // callback function: do something with selectedData;
            }
        });
        //  test data select image jquerry  //
    }

    runTimer() {
        const timer = setInterval(() => {
            this.timeLeft -= 1;
            if (this.timeLeft === 0) {
                clearInterval(timer);
            }
        }, 1000);
    }

    onSelected(option: IOption) {
        this.msg = `Selected ${option.label}`;
    }

    onDeselected(option: IOption) {
        this.msg = `Deselected ${option.label}`;
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
        // this.customer = frm.value;
        // alert(JSON.stringify(frm.value));

        this.customer.customerLastupdate = new Date();

        this.customerService.fetchViewCustomer(this.customer)
            .subscribe(result => {
                // this.customer.customerImage = result.customerImage;
                this.customerService.updateCustomer(this.customer)
                    .subscribe((r) => {
                        // console.log(result.customerImage);
                        // alert(this.customer.customerImage);
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
                        //     timer: 12200
                        // });
                    });
                this.fetchCustomer();
                this.location.back();
                // this.selectedFile = null;
                // this.modalDefaultView.hide();
            });
        // console.log(JSON.stringify(frm.value));
        // alert(JSON.stringify(frm.value));
        // window.location.reload();
        // this.location.back();
        // this.router.navigate(['/management/customers']);
    }


// updateCustomer //

    viewCustomerID(customer: Customer) {
        // this.customerService.fetchViewCustomer(customer).subscribe((r) => this.customer = r);
        this.customerService.fetchViewCustomerId(customer.customerId).subscribe((r) => {

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
        // this.isReadOnly = true;
    }

    editCustomerId(id) {
        // alert(id);
        // this.router.navigate(['/management/customers/customers-edit/' + id + '/mode/edit']);
        this.router.navigate(['/management/customers/customers-edit/' + id ]);
    }

    editCustomer(customer: Customer) {
        this.customerService.fetchViewCustomer(customer).map((m) => {

            // m.customerLastupdate = new Date(m.customerLastupdate);
            // m.customerCreated = new Date(m.customerCreated);
            //
            // const ddStart = new Date(m.customerLastupdate);
            // this.modelPopupCustomerStartDate = {year: ddStart.getFullYear(), month: ddStart.getMonth() + 1, day: ddStart.getDate()};
            //
            // const ddCreate = new Date(m.customerCreated);
            // this.modelPopupCustomerCreated = {year: ddCreate.getFullYear(), month: ddCreate.getMonth() + 1, day: ddCreate.getDate()};
            //
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
        // this.isReadOnly = false;
    }

    // resetFile(state?: string) {
    //     this.imageUrl = state === 'add' ? this.imageUrlBlank : '';
    //     this.resetFileDefault = '';
    // }

    updateCustomer(frm) {
        // this.customer = frm.value;
        const formData = new FormData();
        // formData.append('file', this.selectedFile);
        //
        // this.customer.customerNameSurname = frm.value.customerNameSurname;
        // this.customer.customerEmail = frm.value.customerEmail;
        // this.customer.customerTel = frm.value.customerTel;
        // const {year, month, day} = frm.value.customerLastupdate;
        // this.customer.customerLastupdate = new Date(year, month - 1, day);
        // const {year, month, day} = frm.value.customerCreated;
        // this.customer.customerCreated = new Date(year, month - 1, day);

        // this.customer.customerImage = frm.value.customerImage;

        // ถ้ามีการแก้ไขรูปภาพใหม่
        // if (this.selectedFile) {
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
                    // this.selectedFile = null;
                    // this.modalDefaultView.hide();
                });

        // } else {
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
                    // this.selectedFile = null;
                    // this.modalDefaultView.hide();
                });
        // }
    }

    deleteCustomer(customer: Customer) {
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
                this.customerService.deleteCustomer(customer)
                    .subscribe((r) => {
                        // this.data = this.customerService.fetchCustomer();
                        this.fetchCustomer();
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
    //             // this.customer.customerImage = event.target.result;
    //             this.showImg = event.target.result;
    //         };
    //         reader.readAsDataURL(this.fileToUpload);
    //     } else {
    //         // ไม่เลือกรูปภาพ  ให้โชว์ภาพว่างๆ
    //         // this.customer.customerImage = this.customerCache;
    //         this.showImg = this.customerCache;
    //     }
    // }

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
        if (this.dataSub !== null) { this.dataSub.unsubscribe(); }
        // this.sub.unsubscribe();
    }

}
