import {Component, ElementRef, OnDestroy, OnInit, ViewChild, Input} from '@angular/core';
import 'rxjs/add/observable/of';
import {User} from '../users.interface';
import {UsersService} from '../users.service';
import Swal from 'sweetalert2';
import {Subscription} from 'rxjs';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {environment as env} from '../../../../environments/environment';
import {Router} from '@angular/router';

declare var $: any;

@Component({
    selector: 'app-users-detail',
    templateUrl: './users-detail.component.html',
    styleUrls: ['./users-detail.component.scss',
        '../../../../assets/icon/icofont/css/icofont.scss'
    ]
})

export class UsersDetailComponent implements OnInit, OnDestroy {

// ViewChild
    @ViewChild('modalDefault') modalDefaultView;
    @ViewChild('userFormModal') userFormModal;
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

    modelPopupUserStartDate: NgbDateStruct;
    modelPopupUserCreated: NgbDateStruct;

    public date: { year: number, month: number, day: number };

    selectedFile = null;
    showImg = '';

    user: User = {} as User;
    userCache = '';

    users: User[] = [] as User[];

    isReadOnly = true;

    resetFileDefault = '';

    itemsLevel: any = [
        {id: 99, disabled: true, level: 'superadmin'},
        {id: 1, disabled: true, level: 'admin'},
        {id: 2, disabled: false, level: 'manager'},
        {id: 3, disabled: false, level: 'stock'},
        {id: 4, disabled: false, level: 'sale'},
        {id: 5, disabled: false, level: 'packing'},
        {id: 7, disabled: false, level: 'user'},
        {id: 8, disabled: false, level: 'other'}
    ];

    constructor(
        private userService: UsersService,
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
        this.fetchUser();
        // console.log(this.fetchUser);
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

    fetchUser() {
        this.sub = this.userService.fetchUser()
            .map((m: User[]) => {
                let x = 0;
                m.map(r => {
                    r.index = ++x;
                    if (r.userImage) {
                        r.userImage = `${env.serverAPI}/images/user/` + r.userImage;
                    } else {
                        r.userImage = `${env.serverAPI}/images/image-blank.jpg`;
                    }

                    if (r.userLastlogin) {
                        const dd = r.userLastlogin.toString().split('T');
                        const ddConv = dd[0].split('-');
                        r.userLastlogin = ddConv[2]  + '-' + ddConv[1] + '-' + ddConv[0];
                    }
                    return r;
                });
                return m;
            })
            // .subscribe((r: User[]) => this.users = r);
            .subscribe((r: User[]) => {
                // console.log(r);
                this.users = r;
            });
    }

    onSubmit(frm) {

        this.user = frm.value;
        // alert(JSON.stringify(frm.value));
        // if (this.user.userPassword === this.user.confirmPassword  {
        //     alert(this.user.userPassword + ' - ' + this.user.confirmPassword);
        // } else {
        //     alert('No-Password');
        // }

        const {year, month, day} = frm.value.userLastlogin;
        this.user.userLastlogin = new Date(year, month - 1, day);

        const formData = new FormData();
        formData.append('file', this.selectedFile);

        if (this.user.userPassword === this.user.confirmPassword && this.user.userPassword != null && this.user.userPassword.length >= 4
            && this.user.userLevel !== (null && undefined)) {
            // alert(this.user.userPassword + ' -- ' + this.user.confirmPassword);

            if ((frm.value.userImage === '') || (frm.value.userImage === null)) {
                // console.log('*-- undefined --*');
                this.userService.addUser(this.user)
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
                        this.fetchUser();
                        this.selectedFile = null;
                        this.userFormModal.close('userModal');
                    });

            } else {
                // console.log('--not undefined--');
                this.userService.uploadFile(formData)
                    .subscribe(result => {
                        this.user.userImage = result[0].name;
                        this.userService.addUser(this.user)
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
                                this.fetchUser();
                                this.selectedFile = null;
                                this.userFormModal.close('userModal');
                            });
                    });
            }

        } else {
            // alert(this.user.userPassword + ' XXXX ' + this.user.confirmPassword);
            this.userFormModal.close('userModal');
            const toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 4000
            });
            toast({
                type: 'error',
                text: 'ข้อมูลผิดพลาด  คุณกรอกข้อมูลไม่ถูกต้อง',
            });
            // Swal({
            //     type: 'error',
            //     title: 'ข้อมูลผิดพลาด',
            //     text: 'คุณกรอกข้อมูลไม่ถูกต้อง',
            //     // footer: '<a href>Why do I have this issue?</a>'
            // });
            return false;
        }
        this.fetchUser();
    }

    viewUser(user: User) {
        // this.userService.fetchViewUser(user).subscribe((r) => this.user = r);
        this.userService.fetchViewUser(user).map((m) => {

            m.userLastlogin = new Date(m.userLastlogin);
            m.userCreated = new Date(m.userCreated);

            const ddStart = new Date(m.userLastlogin);
            this.modelPopupUserStartDate = {year: ddStart.getFullYear(), month: ddStart.getMonth() + 1, day: ddStart.getDate()};

            const ddCreate = new Date(m.userCreated);
            this.modelPopupUserCreated = {year: ddCreate.getFullYear(), month: ddCreate.getMonth() + 1, day: ddCreate.getDate()};

            return m;

        }).subscribe((r) => {

            this.user = r;
            if (r.userImage) {
                r.userImage = `${env.serverAPI}/images/user/` + r.userImage;
                this.showImg = r.userImage;
                // this.userCache = r.userImage;
            } else {
                r.userImage = `${env.serverAPI}/images/image-blank.jpg`;
                this.showImg = r.userImage;
                // this.userCache = r.userImage;
            }

        });
        this.isReadOnly = true;
    }

    editUser(user: User) {
        this.userService.fetchViewUser(user).map((m) => {

            m.userLastlogin = new Date(m.userLastlogin);
            m.userCreated = new Date(m.userCreated);

            const ddStart = new Date(m.userLastlogin);
            this.modelPopupUserStartDate = {year: ddStart.getFullYear(), month: ddStart.getMonth() + 1, day: ddStart.getDate()};

            const ddCreate = new Date(m.userCreated);
            this.modelPopupUserCreated = {year: ddCreate.getFullYear(), month: ddCreate.getMonth() + 1, day: ddCreate.getDate()};

            return m;

        }).subscribe((r) => {

            this.user = r;
            if (r.userImage) {
                r.userImage = `${env.serverAPI}/images/user/` + r.userImage;
                this.showImg = r.userImage;
                // this.userCache = r.userImage;
            } else {
                r.userImage = `${env.serverAPI}/images/image-blank.jpg`;
                this.showImg = r.userImage;
                // this.userCache = r.userImage;
            }
        });
        this.isReadOnly = false;
    }

    resetFile(state?: string) {
        this.imageUrl = state === 'add' ? this.imageUrlBlank : '';
        this.resetFileDefault = '';
    }

    updateUser(frm) {
        // this.user = frm.value;
        const formData = new FormData();
        formData.append('file', this.selectedFile);

        this.user.userName = frm.value.userName;
        this.user.userEmail = frm.value.userEmail;
        this.user.userLevel = frm.value.userLevel;
        const {year, month, day} = frm.value.userLastlogin;
        this.user.userLastlogin = new Date(year, month - 1, day);
        // const {year, month, day} = frm.value.userCreated;
        // this.user.userCreated = new Date(year, month - 1, day);

        // this.user.userImage = frm.value.userImage;

        // ถ้ามีการแก้ไขรูปภาพใหม่
        if (this.selectedFile) {
            // console.log('Images TRUE =>> ' + this.selectedFile.name);
            this.userService.uploadFile(formData)
                .subscribe(result => {
                    this.user.userImage = result[0].name;
                    this.userService.updateUser(this.user)
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
                    this.fetchUser();
                    this.selectedFile = null;
                    this.modalDefaultView.hide();
                });

        } else {
            this.userService.fetchViewUser(this.user)
                .subscribe(result => {
                    this.user.userImage = result.userImage;
                    this.userService.updateUser(this.user)
                        .subscribe((r) => {
                            // console.log(result.userImage);
                            // alert(this.user.userImage);
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
                    this.fetchUser();
                    this.selectedFile = null;
                    this.modalDefaultView.hide();
                });
        }
    }

    deleteUser(user: User) {
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
                this.userService.deleteUser(user)
                    .subscribe((r) => {
                        // this.data = this.userService.fetchUser();
                        this.fetchUser();
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
                // this.user.userImage = event.target.result;
                this.showImg = event.target.result;
            };
            reader.readAsDataURL(this.fileToUpload);
        } else {
            // ไม่เลือกรูปภาพ  ให้โชว์ภาพว่างๆ
            // this.user.userImage = this.userCache;
            this.showImg = this.userCache;
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



