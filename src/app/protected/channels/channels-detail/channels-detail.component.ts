import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {Channel} from '../channels.interface';
import {ChannelsService} from '../channels.service';
import Swal from 'sweetalert2';
import {environment as env} from '../../../../environments/environment';

// import API warehouse //
import {Warehouse} from '../../stocks/warehouses.interface';
import {WarehousesService} from '../../stocks/warehouses.service';

import {UiSwitchModule} from 'ng2-ui-switch';
import {ArchwizardModule} from 'ng2-archwizard/dist';

declare var $: any;

@Component({
    selector: 'app-channels-detail',
    templateUrl: './channels-detail.component.html',
    styleUrls: [
        './channels-detail.component.scss',
        '../../../../assets/icon/icofont/css/icofont.scss'
    ]
})

export class ChannelsDetailComponent implements OnInit, OnDestroy {

// ViewChild
    @ViewChild('modalDefault') modalDefaultView;
    @ViewChild('modalDefaultWizard') modalDefaultWizardView;
    @ViewChild('channelFormModal') channelFormModal;
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
    modelPopup: NgbDateStruct = {} as NgbDateStruct;

    modelPopupChannelLastupdate: NgbDateStruct;
    modelPopupChannelCreated: NgbDateStruct;

    public date: { year: number, month: number, day: number };

    selectedFile = null;
    showImg = '';

    channel: Channel = {} as Channel;
    // warehouse: Warehouse = {} as Warehouse;
    channelCache = '';

    value1 = '';

    channels: Channel[] = [] as Channel[];
    warehouses: Warehouse[] = [] as Warehouse[];
    isReadOnly = true;

    resetFileDefault = '';

    constructor(
        private channelService: ChannelsService,
        // private warehouseService: WarehousesService
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
        this.fetchChannel();
        // START skip warehouse service => not use //
        // this.fetchWarehouse();
        // this.fetchWarehouseDefualt();
        // END skip warehouse service => not use //
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

    // skip warehouse service => not use //
    // fetchWarehouse() {
    //     // Test Moment  show Time Diff//
    //     // let now = moment().format('LLLL');
    //     // console.log(moment([2018, 9, 5, 12:48 ]).toNow());
    //
    //     this.sub = this.warehouseService.fetchWarehouse()
    //         .subscribe((r: Warehouse[]) => {
    //             let x = 0;
    //             r.map(r => {
    //                 r.index = ++x;
    //                 return r;
    //             })
    //             // console.log(r);
    //             this.warehouses = r;
    //         });
    // }
    //
    // fetchWarehouseDefualt() {
    //     this.sub = this.warehouseService.fetchWarehouseDefualt()
    //         .subscribe((r: Warehouse) => {
    //             this.warehouse = r;
    //         });
    // }
    // skip warehouse service => not use //

    onSubmit(frm) {

        this.channel = frm.value;
        // this.channel.channelCTId = this.channelCTId;
        // alert(JSON.stringify(frm.value));

        const {year, month, day} = frm.value.channelLastupdate;
        this.channel.channelLastupdate = new Date(year, month - 1, day);

        const formData = new FormData();
        formData.append('file', this.selectedFile);

        if ((frm.value.channelImage === '') || (frm.value.channelImage === null)) {
            // console.log('*-- undefined --*');

            this.channelService.addChannel(this.channel)
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
                    this.fetchChannel();
                    this.selectedFile = null;
                    // this.channelFormModal.close('channelModal');
                    this.modalDefaultWizardView.hide();
                    // this.channelFormModal.close('modalDefaultWizard');
                });

        } else {
            // console.log('--not undefined--');
            this.channelService.uploadFile(formData)
                .subscribe(result => {
                    this.channel.channelImage = result[0].name;
                    this.channelService.addChannel(this.channel)
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
                            this.fetchChannel();
                            this.selectedFile = null;
                            // this.channelFormModal.close('channelModal');
                            // this.modalDefaultWizardView.hide();
                            this.modalDefaultWizardView.hide();
                        });
                });
        }
        this.fetchChannel();
    }

    viewChannel(channel: Channel) {
        // this.channelService.fetchViewChannel(channel).subscribe((r) => this.channel = r);
        this.channelService.fetchViewChannel(channel).map((m) => {

            m.channelLastupdate = new Date(m.channelLastupdate);
            m.channelCreated = new Date(m.channelCreated);

            const ddStart = new Date(m.channelLastupdate);
            this.modelPopupChannelLastupdate = {year: ddStart.getFullYear(), month: ddStart.getMonth() + 1, day: ddStart.getDate()};

            const ddCreate = new Date(m.channelCreated);
            this.modelPopupChannelCreated = {year: ddCreate.getFullYear(), month: ddCreate.getMonth() + 1, day: ddCreate.getDate()};

            return m;

        }).subscribe((r) => {

            this.channel = r;
            if (r.channelImage) {
                r.channelImage = `${env.serverAPI}/images/channel/` + r.channelImage;
                this.showImg = r.channelImage;
                this.channelCache = r.channelImage;
            } else {
                r.channelImage = `${env.serverAPI}/images/image-blank.jpg`;
                this.showImg = r.channelImage;
                this.channelCache = r.channelImage;
            }

        });
        this.isReadOnly = true;
    }

    editChannel(channel: Channel) {
        this.channelService.fetchViewChannel(channel).map((m) => {

            m.channelLastupdate = new Date(m.channelLastupdate);
            m.channelCreated = new Date(m.channelCreated);

            const ddStart = new Date(m.channelLastupdate);
            this.modelPopupChannelLastupdate = {year: ddStart.getFullYear(), month: ddStart.getMonth() + 1, day: ddStart.getDate()};

            const ddCreate = new Date(m.channelCreated);
            this.modelPopupChannelCreated = {year: ddCreate.getFullYear(), month: ddCreate.getMonth() + 1, day: ddCreate.getDate()};

            return m;

        }).subscribe((r) => {

            this.channel = r;
            if (r.channelImage) {
                r.channelImage = `${env.serverAPI}/images/channel/` + r.channelImage;
                this.showImg = r.channelImage;
                this.channelCache = r.channelImage;
            } else {
                r.channelImage = `${env.serverAPI}/images/image-blank.jpg`;
                this.showImg = r.channelImage;
                this.channelCache = r.channelImage;
            }
        });
        this.isReadOnly = false;
    }

    resetFile(state?: string) {
        this.imageUrl = state === 'add' ? this.imageUrlBlank : '';
        this.resetFileDefault = '';
    }

    updateChannel(frm) {
        // this.channel = frm.value;
        // alert(JSON.stringify(frm.value));

        const formData = new FormData();
        formData.append('file', this.selectedFile);

        this.channel.channelName = frm.value.channelName;
        this.channel.channelComment = frm.value.channelComment;
        const {year, month, day} = frm.value.channelLastupdate;
        this.channel.channelLastupdate = new Date(year, month - 1, day);
        // const {year, month, day} = frm.value.channelCreated;
        // this.channel.channelCreated = new Date(year, month - 1, day);

        // this.channel.channelImage = frm.value.channelImage;

        // ถ้ามีการแก้ไขรูปภาพใหม่
        if (this.selectedFile) {
            // console.log('Images TRUE =>> ' + this.selectedFile.name);
            this.channelService.uploadFile(formData)
                .subscribe(result => {
                    this.channel.channelImage = result[0].name;
                    this.channelService.updateChannel(this.channel)
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
                    this.fetchChannel();
                    this.selectedFile = null;
                    this.modalDefaultView.hide();
                    // this.modalDefaultWizardView.hide();
                });

        } else {
            this.channelService.fetchViewChannel(this.channel)
                .subscribe(result => {
                    this.channel.channelImage = result.channelImage;
                    this.channelService.updateChannel(this.channel)
                        .subscribe((r) => {
                            // console.log(result.channelImage);
                            // alert(this.channel.channelImage);
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
                    this.fetchChannel();
                    this.selectedFile = null;
                    this.modalDefaultView.hide();
                    // this.modalDefaultWizardView.hide();
                });
        }
        this.fetchChannel();
    }

    deleteChannel(channel: Channel) {
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
                this.channelService.deleteChannel(channel)
                    .subscribe((r) => {
                        // this.data = this.channelService.fetchChannel();
                        this.fetchChannel();
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
                this.channel.channelImage = event.target.result;
                this.showImg = event.target.result;
            };
            reader.readAsDataURL(this.fileToUpload);
        } else {
            // ไม่เลือกรูปภาพ  ให้โชว์ภาพว่างๆ
            this.showImg = this.channelCache;
            this.channel.channelImage = this.channelCache;
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
