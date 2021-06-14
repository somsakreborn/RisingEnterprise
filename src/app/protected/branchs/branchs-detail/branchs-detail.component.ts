import {Component, Input, OnDestroy, OnInit, ViewChild, ElementRef} from '@angular/core';
import 'rxjs/add/observable/of';
import {Branch} from '../branchs.interface';
import {BranchService} from '../branchs.service';
import Swal from 'sweetalert2';
import {Subscription} from 'rxjs';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {environment as env} from '../../../../environments/environment';

declare var $: any;

@Component({
    selector: 'app-branchs-detail',
    templateUrl: './branchs-detail.component.html',
    styleUrls: ['./branchs-detail.component.scss',
        '../../../../assets/icon/icofont/css/icofont.scss'
    ]
})

export class BranchsDetailComponent implements OnInit, OnDestroy {

    // ViewChild
    @ViewChild('modalDefault') modalDefaultView;
    @ViewChild('branchFormModal') branchFormModal;
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

    modelPopupBranchStartDate: NgbDateStruct;
    modelPopupBranchCreated: NgbDateStruct;

    public date: { year: number, month: number, day: number };

    selectedFile = null;
    showImg = '';

    branch: Branch = {} as Branch;
    branchCache = '';

    branches: Branch[] = [] as Branch[];

    isReadOnly = true;

    resetFileDefault = '';

    constructor(
        private branchService: BranchService
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
        this.fetchBranch();
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

    fetchBranch() {
        this.sub = this.branchService.fetchBranch()
            .map((m: Branch[]) => {
                let x = 0;
                m.map(r => {
                    r.index = ++x;
                    if (r.branchImage) {
                        r.branchImage = `${env.serverAPI}/images/branch/` + r.branchImage;
                    } else {
                        r.branchImage = `${env.serverAPI}/images/image-blank.jpg`;
                    }

                    if (r.branchStartDate) {
                        const dd = r.branchStartDate.toString().split('T');
                        const ddConv = dd[0].split('-');
                        r.branchStartDate = ddConv[2] + '-' + ddConv[1] + '-' + ddConv[0];
                    }
                    return r;
                });
                return m;
            })
            // .subscribe((r: Branch[]) => this.branchs = r);
            .subscribe((r: Branch[]) => {
                // console.log(r);
                this.branches = r;
            });
    }

    onSubmit(frm) {

        this.branch = frm.value;

        const {year, month, day} = frm.value.branchStartDate;
        this.branch.branchStartDate = new Date(year, month - 1, day);

        const formData = new FormData();
        formData.append('file', this.selectedFile);

        if ((frm.value.branchImage === '') || (frm.value.branchImage === null)) {
            // console.log('*-- undefined --*');
            this.branchService.addBranch(this.branch)
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
                    this.fetchBranch();
                    this.selectedFile = null;
                    this.branchFormModal.close('branchModal');
                });

        } else {
            // console.log('--not undefined--');
            this.branchService.uploadFile(formData)
                .subscribe(result => {
                    this.branch.branchImage = result[0].name;
                    this.branchService.addBranch(this.branch)
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
                            this.fetchBranch();
                            this.selectedFile = null;
                            this.branchFormModal.close('branchModal');
                        });
                });
        }
        this.fetchBranch();
    }

    viewBranch(branch: Branch) {
        // this.branchService.fetchViewBranch(branch).subscribe((r) => this.branch = r);
        this.branchService.fetchViewBranch(branch).map((m) => {

            m.branchStartDate = new Date(m.branchStartDate);
            m.branchCreated = new Date(m.branchCreated);

            const ddStart = new Date(m.branchStartDate);
            this.modelPopupBranchStartDate = {year: ddStart.getFullYear(), month: ddStart.getMonth() + 1, day: ddStart.getDate()};

            const ddCreate = new Date(m.branchCreated);
            this.modelPopupBranchCreated = {year: ddCreate.getFullYear(), month: ddCreate.getMonth() + 1, day: ddCreate.getDate()};

            return m;

        }).subscribe((r) => {

            this.branch = r;
            if (r.branchImage) {
                r.branchImage = `${env.serverAPI}/images/branch/` + r.branchImage;
                this.showImg = r.branchImage;
                // this.branchCache = r.branchImage;
            } else {
                r.branchImage = `${env.serverAPI}/images/image-blank.jpg`;
                this.showImg = r.branchImage;
                // this.branchCache = r.branchImage;
            }

        });
        this.isReadOnly = true;
    }

    editBranch(branch: Branch) {
        this.branchService.fetchViewBranch(branch).map((m) => {

            m.branchStartDate = new Date(m.branchStartDate);
            m.branchCreated = new Date(m.branchCreated);

            const ddStart = new Date(m.branchStartDate);
            this.modelPopupBranchStartDate = {year: ddStart.getFullYear(), month: ddStart.getMonth() + 1, day: ddStart.getDate()};

            const ddCreate = new Date(m.branchCreated);
            this.modelPopupBranchCreated = {year: ddCreate.getFullYear(), month: ddCreate.getMonth() + 1, day: ddCreate.getDate()};

            return m;

        }).subscribe((r) => {

            this.branch = r;
            if (r.branchImage) {
                r.branchImage = `${env.serverAPI}/images/branch/` + r.branchImage;
                this.showImg = r.branchImage;
                // this.branchCache = r.branchImage;
            } else {
                r.branchImage = `${env.serverAPI}/images/image-blank.jpg`;
                this.showImg = r.branchImage;
                // this.branchCache = r.branchImage;
            }
        });
        this.isReadOnly = false;
    }

    resetFile(state?: string) {
        this.imageUrl = state === 'add' ? this.imageUrlBlank : '';
        this.resetFileDefault = '';
    }

    updateBranch(frm) {
        // this.branch = frm.value;
        const formData = new FormData();
        formData.append('file', this.selectedFile);

        this.branch.branchName = frm.value.branchName;
        this.branch.branchComment = frm.value.branchComment;
        const {year, month, day} = frm.value.branchStartDate;
        this.branch.branchStartDate = new Date(year, month - 1, day);
        // const {year, month, day} = frm.value.branchCreated;
        // this.branch.branchCreated = new Date(year, month - 1, day);

        // this.branch.branchImage = frm.value.branchImage;

        // ถ้ามีการแก้ไขรูปภาพใหม่
        if (this.selectedFile) {
            // console.log('Images TRUE =>> ' + this.selectedFile.name);
            this.branchService.uploadFile(formData)
                .subscribe(result => {
                    this.branch.branchImage = result[0].name;
                    this.branchService.updateBranch(this.branch)
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
                    this.fetchBranch();
                    this.selectedFile = null;
                    this.modalDefaultView.hide();
                });

        } else {
            this.branchService.fetchViewBranch(this.branch)
                .subscribe(result => {
                    this.branch.branchImage = result.branchImage;
                    this.branchService.updateBranch(this.branch)
                        .subscribe((r) => {
                            // console.log(result.branchImage);
                            // alert(this.branch.branchImage);
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
                    this.fetchBranch();
                    this.selectedFile = null;
                    this.modalDefaultView.hide();
                });
        }
    }

    deleteBranch(branch: Branch) {
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
                this.branchService.deleteBranch(branch)
                    .subscribe((r) => {
                        // this.data = this.branchService.fetchBranch();
                        this.fetchBranch();
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
                this.showImg = event.target.result;
                // this.branch.branchImage = event.target.result;
            };
            reader.readAsDataURL(this.fileToUpload);
        } else {
            // ไม่เลือกรูปภาพ  ให้โชว์ภาพว่างๆ
            this.showImg = this.branchCache;
            // this.branch.branchImage = this.branchCache;
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
