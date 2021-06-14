import {Component, ElementRef, OnDestroy, OnInit, ViewChild, Input} from '@angular/core';
import 'rxjs/add/observable/of';
import {Bank} from '../banks.interface';
import {BankService} from '../banks.service';
import Swal from 'sweetalert2';
import {Subscription} from 'rxjs';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {environment as env} from '../../../../environments/environment';

declare var $: any;

@Component({
    selector: 'app-banks-detail',
    templateUrl: './banks-detail.component.html',
    styleUrls: ['./banks-detail.component.scss',
        '../../../../assets/icon/icofont/css/icofont.scss'
    ]
})

export class BanksDetailComponent implements OnInit, OnDestroy {

// ViewChild
    @ViewChild('modalDefault') modalDefaultView;
    @ViewChild('bankFormModal') bankFormModal;
    @Input('modalDefault') modalDefault: any;
    @ViewChild('Image') Image: ElementRef;
    public maskUsbank = [/[0-9]/, /\d/, /\d/, '-', /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/];

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

    modelPopupBankStartDate: NgbDateStruct;
    modelPopupBankCreated: NgbDateStruct;

    public date: { year: number, month: number, day: number };

    selectedFile = null;
    showImg = '';

    bank: Bank = {} as Bank;
    bankCache = '';

    banks: Bank[] = [] as Bank[];

    isReadOnly = true;

    resetFileDefault = '';

    constructor(
        private bankService: BankService
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
        this.fetchBank();
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
            });
    }

    onSubmit(frm) {

        this.bank = frm.value;

        const {year, month, day} = frm.value.bankStartDate;
        this.bank.bankStartDate = new Date(year, month - 1, day);

        const formData = new FormData();
        formData.append('file', this.selectedFile);

        if ((frm.value.bankImage === '') || (frm.value.bankImage === null)) {
            // console.log('*-- undefined --*');
            this.bankService.addBank(this.bank)
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
                    this.fetchBank();
                    this.selectedFile = null;
                    this.bankFormModal.close('bankModal');
                });

        } else {
            // console.log('--not undefined--');
            this.bankService.uploadFile(formData)
                .subscribe(result => {
                    this.bank.bankImage = result[0].name;
                    this.bankService.addBank(this.bank)
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
                            this.fetchBank();
                            this.selectedFile = null;
                            this.bankFormModal.close('bankModal');
                        });
                });
        }
        this.fetchBank();
    }

    viewBank(bank: Bank) {
        // this.bankService.fetchViewBank(bank).subscribe((r) => this.bank = r);
        this.bankService.fetchViewBank(bank).map((m) => {

            m.bankStartDate = new Date(m.bankStartDate);
            m.bankCreated = new Date(m.bankCreated);

            const ddStart = new Date(m.bankStartDate);
            this.modelPopupBankStartDate = {year: ddStart.getFullYear(), month: ddStart.getMonth() + 1, day: ddStart.getDate()};

            const ddCreate = new Date(m.bankCreated);
            this.modelPopupBankCreated = {year: ddCreate.getFullYear(), month: ddCreate.getMonth() + 1, day: ddCreate.getDate()};

            return m;

        }).subscribe((r) => {

            this.bank = r;
            if (r.bankImage) {
                r.bankImage = `${env.serverAPI}/images/bank/` + r.bankImage;
                this.showImg = r.bankImage;
                // this.bankCache = r.bankImage;
            } else {
                r.bankImage = `${env.serverAPI}/images/image-blank.jpg`;
                this.showImg = r.bankImage;
                // this.bankCache = r.bankImage;
            }

        });
        this.isReadOnly = true;
    }

    editBank(bank: Bank) {
        this.bankService.fetchViewBank(bank).map((m) => {

            m.bankStartDate = new Date(m.bankStartDate);
            m.bankCreated = new Date(m.bankCreated);

            const ddStart = new Date(m.bankStartDate);
            this.modelPopupBankStartDate = {year: ddStart.getFullYear(), month: ddStart.getMonth() + 1, day: ddStart.getDate()};

            const ddCreate = new Date(m.bankCreated);
            this.modelPopupBankCreated = {year: ddCreate.getFullYear(), month: ddCreate.getMonth() + 1, day: ddCreate.getDate()};

            return m;

        }).subscribe((r) => {

            this.bank = r;
            if (r.bankImage) {
                r.bankImage = `${env.serverAPI}/images/bank/` + r.bankImage;
                this.showImg = r.bankImage;
                // this.bankCache = r.bankImage;
            } else {
                r.bankImage = `${env.serverAPI}/images/image-blank.jpg`;
                this.showImg = r.bankImage;
                // this.bankCache = r.bankImage;
            }
        });
        this.isReadOnly = false;
    }

    resetFile(state?: string) {
        this.imageUrl = state === 'add' ? this.imageUrlBlank : '';
        this.resetFileDefault = '';
    }

    updateBank(frm) {
        // this.bank = frm.value;
        const formData = new FormData();
        formData.append('file', this.selectedFile);

        this.bank.bankName = frm.value.bankName;
        this.bank.bankBranchname = frm.value.bankBranchname;
        this.bank.bankComment = frm.value.bankComment;
        this.bank.bankStatus = frm.value.bankStatus;
        const {year, month, day} = frm.value.bankStartDate;
        this.bank.bankStartDate = new Date(year, month - 1, day);
        // const {year, month, day} = frm.value.bankCreated;
        // this.bank.bankCreated = new Date(year, month - 1, day);

        // this.bank.bankImage = frm.value.bankImage;

        // ถ้ามีการแก้ไขรูปภาพใหม่
        if (this.selectedFile) {
            // console.log('Images TRUE =>> ' + this.selectedFile.name);
            this.bankService.uploadFile(formData)
                .subscribe(result => {
                    this.bank.bankImage = result[0].name;
                    this.bankService.updateBank(this.bank)
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
                    this.fetchBank();
                    this.selectedFile = null;
                    this.modalDefaultView.hide();
                });

        } else {
            this.bankService.fetchViewBank(this.bank)
                .subscribe(result => {
                    this.bank.bankImage = result.bankImage;
                    this.bankService.updateBank(this.bank)
                        .subscribe((r) => {
                            // console.log(result.bankImage);
                            // alert(this.bank.bankImage);
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
                    this.fetchBank();
                    this.selectedFile = null;
                    this.modalDefaultView.hide();
                });
        }
    }

    deleteBank(bank: Bank) {
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
                this.bankService.deleteBank(bank)
                    .subscribe((r) => {
                        // this.data = this.bankService.fetchBank();
                        this.fetchBank();
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
                // this.bank.bankImage = event.target.result;
                this.showImg = event.target.result;
            };
            reader.readAsDataURL(this.fileToUpload);
        } else {
            // ไม่เลือกรูปภาพ  ให้โชว์ภาพว่างๆ
            // this.bank.bankImage = this.bankCache;
            this.showImg = this.bankCache;
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
