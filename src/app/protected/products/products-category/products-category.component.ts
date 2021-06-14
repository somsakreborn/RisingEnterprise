import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import 'rxjs/add/observable/of';
import {Counter} from '../counter.interface';
import {CounterService} from '../counter.service';
import {Category} from '../catagory.interface';
import {CategoryService} from '../category.service';
import Swal from 'sweetalert2';
import {Observable, Subscription} from 'rxjs';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {environment as env} from '../../../../environments/environment';

declare var $: any;

@Component({
  selector: 'app-products-category',
  templateUrl: './products-category.component.html',
  styleUrls: [
      './products-category.component.scss',
      '../../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class ProductsCategoryComponent implements OnInit, OnDestroy {

// ViewChild
    @ViewChild('modalDefault') modalDefaultView;
    @ViewChild('categoryFormModal') categoryFormModal;
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

    modelPopupCategoryLastupdate: NgbDateStruct;
    modelPopupCategoryCreated: NgbDateStruct;

    public date: { year: number, month: number, day: number };

    selectedFile = null;
    showImg = '';

    // new by. bamossza
    category: Category = {} as Category;
    categoryCache = '';

    // category ===> {  . . ..  .. }

    // test str replace //
    CTId: any;
    rex: number;
    categoryCTId: string;
    // counter: Counter;
    // test str replace //

    counterCTId: Counter = {} as Counter;

    categorys: Category[] = [] as Category[];

    isReadOnly = true;

    resetFileDefault = '';

    constructor(
        private categoryService: CategoryService,
        private counterService: CounterService
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
        this.fetchCategory();
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

    fetchCounter() {
        this.counterService.fetchCounterCategory()
            .subscribe((result) => {
                // console.log(result);
                if (result.id) {
                    this.counterCTId = result;
                    this.CTId = 'CT00000000';
                    this.rex = this.CTId.length - (this.counterCTId.seq + 1).toString().length;
                    this.categoryCTId = this.CTId.slice(0, this.rex) + (this.counterCTId.seq + 1).toString();
                } else {
                    this.categoryCTId = 'CT00000001';
                }
                // console.log(this.categoryCTId);
            });
    }

    fetchCategory() {
        this.sub = this.categoryService.fetchCategory()
            .map((m: Category[]) => {
                let x = 0;
                m.map(r => {
                    r.index = ++x;
                    if (r.categoryImage) {
                        r.categoryImage = `${env.serverAPI}/images/category/` + r.categoryImage;
                    } else {
                        r.categoryImage = `${env.serverAPI}/images/image-blank.jpg`;
                    }

                    if (r.categoryLastupdate) {
                        const dd = r.categoryLastupdate.toString().split('T');
                        const ddConv = dd[0].split('-');
                        r.categoryLastupdate = ddConv[2] + '-' + ddConv[1] + '-' + ddConv[0];
                    }
                    return r;
                });
                return m;
            })
            // .subscribe((r: Category[]) => this.categorys = r);
            .subscribe((r: Category[]) => {
                // console.log(r);
                this.categorys = r;
            });
    }

    onSubmit(frm) {

        this.category = frm.value;
        // this.category.categoryCTId = this.categoryCTId;
        // alert(JSON.stringify(frm.value));

        const {year, month, day} = frm.value.categoryLastupdate;
        this.category.categoryLastupdate = new Date(year, month - 1, day);

        // const formData = new FormData();
        // formData.append('file', this.selectedFile);

        // if ((frm.value.categoryImage === '') || (frm.value.categoryImage === null)) {
            // console.log('*-- undefined --*');

            this.categoryService.addCategory(this.category)
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
                    this.fetchCategory();
                    this.selectedFile = null;
                    this.categoryFormModal.close('categoryModal');
                });

        // } else {
            // console.log('--not undefined--');
            // this.categoryService.uploadFile(formData)
            //     .subscribe(result => {
            //         this.category.categoryImage = result[0].name;
            //         this.categoryService.addCategory(this.category)
            //             .subscribe(() => {
            //                 Swal({
            //                     position: 'center',
            //                     type: 'success',
            //                     title: 'เพิ่มข้อมูลสาขา เรียบร้อยแล้ว',
            //                     showConfirmButton: false,
            //                     timer: 1200
            //                 });
            //                 this.fetchCategory();
            //                 this.selectedFile = null;
            //                 this.categoryFormModal.close('categoryModal');
            //             });
            //     });
        // }
        this.fetchCategory();
    }

    viewCategory(category: Category) {
        // this.categoryService.fetchViewCategory(category).subscribe((r) => this.category = r);
        this.categoryService.fetchViewCategory(category).map((m) => {

            m.categoryLastupdate = new Date(m.categoryLastupdate);
            m.categoryCreated = new Date(m.categoryCreated);

            const ddStart = new Date(m.categoryLastupdate);
            this.modelPopupCategoryLastupdate = {year: ddStart.getFullYear(), month: ddStart.getMonth() + 1, day: ddStart.getDate()};

            const ddCreate = new Date(m.categoryCreated);
            this.modelPopupCategoryCreated = {year: ddCreate.getFullYear(), month: ddCreate.getMonth() + 1, day: ddCreate.getDate()};

            return m;

        }).subscribe((r) => {

            this.category = r;
            if (r.categoryImage) {
                r.categoryImage = `${env.serverAPI}/images/category/` + r.categoryImage;
                this.showImg = r.categoryImage;
                this.categoryCache = r.categoryImage;
            } else {
                r.categoryImage = `${env.serverAPI}/images/image-blank.jpg`;
                this.showImg = r.categoryImage;
                this.categoryCache = r.categoryImage;
            }

        });
        this.isReadOnly = true;
    }

    editCategory(category: Category) {
        this.categoryService.fetchViewCategory(category).map((m) => {

            m.categoryLastupdate = new Date(m.categoryLastupdate);
            m.categoryCreated = new Date(m.categoryCreated);

            const ddStart = new Date(m.categoryLastupdate);
            this.modelPopupCategoryLastupdate = {year: ddStart.getFullYear(), month: ddStart.getMonth() + 1, day: ddStart.getDate()};

            const ddCreate = new Date(m.categoryCreated);
            this.modelPopupCategoryCreated = {year: ddCreate.getFullYear(), month: ddCreate.getMonth() + 1, day: ddCreate.getDate()};

            return m;

        }).subscribe((r) => {

            this.category = r;
            if (r.categoryImage) {
                r.categoryImage = `${env.serverAPI}/images/category/` + r.categoryImage;
                this.showImg = r.categoryImage;
                this.categoryCache = r.categoryImage;
            } else {
                r.categoryImage = `${env.serverAPI}/images/image-blank.jpg`;
                this.showImg = r.categoryImage;
                this.categoryCache = r.categoryImage;
            }
        });
        this.isReadOnly = false;
    }

    resetFile(state?: string) {
        this.imageUrl = state === 'add' ? this.imageUrlBlank : '';
        this.resetFileDefault = '';
    }

    updateCategory(frm) {
        // this.category = frm.value;
        const formData = new FormData();
        formData.append('file', this.selectedFile);

        this.category.categoryName = frm.value.categoryName;
        this.category.categoryComment = frm.value.categoryComment;
        const {year, month, day} = frm.value.categoryLastupdate;
        this.category.categoryLastupdate = new Date(year, month - 1, day);
        // const {year, month, day} = frm.value.categoryCreated;
        // this.category.categoryCreated = new Date(year, month - 1, day);

        // this.category.categoryImage = frm.value.categoryImage;

        // ถ้ามีการแก้ไขรูปภาพใหม่
        if (this.selectedFile) {
            // console.log('Images TRUE =>> ' + this.selectedFile.name);
            this.categoryService.uploadFile(formData)
                .subscribe(result => {
                    this.category.categoryImage = result[0].name;
                    this.categoryService.updateCategory(this.category)
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
                    this.fetchCategory();
                    this.selectedFile = null;
                    this.modalDefaultView.hide();
                });

        } else {
            this.categoryService.fetchViewCategory(this.category)
                .subscribe(result => {
                    this.category.categoryImage = result.categoryImage;
                    this.categoryService.updateCategory(this.category)
                        .subscribe((r) => {
                            // console.log(result.categoryImage);
                            // alert(this.category.categoryImage);
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
                    this.fetchCategory();
                    this.selectedFile = null;
                    this.modalDefaultView.hide();
                });
        }
    }

    deleteCategory(category: Category) {
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
                this.categoryService.deleteCategory(category)
                    .subscribe((r) => {
                        // this.data = this.categoryService.fetchCategory();
                        this.fetchCategory();
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
                this.category.categoryImage = event.target.result;
                this.showImg = event.target.result;
            };
            reader.readAsDataURL(this.fileToUpload);
        } else {
            // ไม่เลือกรูปภาพ  ให้โชว์ภาพว่างๆ
            this.showImg = this.categoryCache;
            this.category.categoryImage = this.categoryCache;
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
