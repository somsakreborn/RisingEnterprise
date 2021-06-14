import {Component, Input, OnInit, ViewChild} from '@angular/core';
import 'rxjs/add/observable/of';
import {Employee, ResponseJson} from '../employee.interface';
import {EmployeeService} from '../employee.service';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
    selector: 'app-employees-detail',
    templateUrl: './employees-detail.component.html',
    styleUrls: ['./employees-detail.component.scss',
        '../../../../assets/icon/icofont/css/icofont.scss'
    ]
})

export class EmployeesDetailComponent implements OnInit {

    // @ViewChild('employeeUpdateForm') employeeUpdateForm: NgForm;
    @ViewChild('modalDefault') modalDefaultView;

    headerArr = [];
    headerValueArr = [];

    rowsOnPage = 25;
    filterQuery = '';
    public sortBy = '';
    public sortOrder = 'asc';

    @Input('modalDefault') modalDefault: any;

    // new by. bamossza
    employee: Employee = {} as Employee;

    // employee ===> {  . . ..  .. }

    employees: Employee[] = [] as Employee[];

    isReadOnly = true;

    constructor(
        private employeeService: EmployeeService
    ) {

    }

    ngOnInit() {

        // this.employeeService.fetchEmployee()
        //     .map((m: Employee[]) => {
        //         let x = 0;
        //         m.map(r => {
        //             r.index = ++x;
        //             return r;
        //         });
        //         return m;
        //     })
        //     .subscribe((r) => {
        //         console.log(r);
        //     });


        this.employeeService.fetchEmployee()
            .subscribe((r: ResponseJson<Employee[]>) => {
                if (r.tableHeader) {
                    const headArr = (<string>r.tableHeader).split(',');
                    headArr.map(m => {
                        const h = m.split('|');
                        this.headerArr.push(h[0]);
                        this.headerValueArr.push({head: h[0], value: h[1], seq: Number(h[2])});
                    });

                    this.headerValueArr = this.headerValueArr
                        .sort((a, b) => {
                            return a.seq - b.seq;
                        });
                }
                let x = 0;
                this.employees = (<Employee[]>r.result)
                    .map((m: Employee) => {
                        m.index = ++x;
                        return m;
                    });
            });
    }

    checkTableBody(field: string) {
        return $.inArray(field, this.headerArr);
    }

    onSubmit(frm) {
        this.employee = frm.value;
        this.employeeService.addEmployee(this.employee)
            .subscribe((r) => {
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
                //     title: 'เพิ่มข้อมูลพนักงาน เรียบร้อยแล้ว',
                //     showConfirmButton: false,
                //     timer: 1200
                // });
            });

        $('.md-modal').removeClass('md-show');
        window.location.reload(true);
    }

    viewEmployee(employee: Employee) {
        this.employeeService.fetchViewEmployee(employee).subscribe((r) => this.employee = r);
        this.isReadOnly = true;
    }

    editEmployee(employee: Employee) {
        this.employeeService.fetchViewEmployee(employee).subscribe((r) => this.employee = r);
        this.isReadOnly = false;
    }

    updateEmployee(frm) {

        const {
            employeeName,
            employeeSurname,
            employeePosition,
            employeeAge,
            employeeEmail,
            employeeBranch,
            employeeSalary,
            employeeGender,
            employeeComment,
            employeeStartDate,
            employeeCreated
        } = frm.value;

        this.employee.employeeName = employeeName;
        this.employee.employeeSurname = employeeSurname;
        this.employee.employeePosition = employeePosition;
        this.employee.employeeAge = employeeAge;
        this.employee.employeeEmail = employeeEmail;
        this.employee.employeeBranch = employeeBranch;
        this.employee.employeeSalary = employeeSalary;
        this.employee.employeeGender = employeeGender;
        this.employee.employeeComment = employeeComment;
        this.employee.employeeStartDate = employeeStartDate;
        this.employee.employeeCreated = employeeCreated;

        this.employeeService.updateEmployee(this.employee)
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

                // let x = 3;
                //
                // console.log('-- Before --');
                // console.log(this.employees);
                // console.log('x ==> ' + x);

                // Process
                // console.log('-- Process --');
                // console.log();
                // x = 5;
                this.employees
                    .filter(f => f.employeeId === this.employee.employeeId)
                    .map(m => {

                        m.employeeName = this.employee.employeeName;
                        m.employeeSurname = this.employee.employeeSurname;
                        m.employeePosition = this.employee.employeePosition;
                        m.employeeAge = this.employee.employeeAge;
                        m.employeeEmail = this.employee.employeeEmail;
                        m.employeeBranch = this.employee.employeeBranch;
                        m.employeeSalary = this.employee.employeeSalary;
                        m.employeeGender = this.employee.employeeGender;
                        m.employeeComment = this.employee.employeeComment;
                        m.employeeStartDate = this.employee.employeeStartDate;
                        m.employeeCreated = this.employee.employeeCreated;

                        return m;
                    });

                // End process
                //
                // console.log('-- After --');
                // console.log(this.employees);
                // console.log('x ==> ' + x);

                this.modalDefaultView.hide();
            });
    }

    deleteEmployee(employee: Employee) {
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
                this.employeeService.deleteEmployee(employee)
                    .subscribe((r) => {
                        // this.data = this.employeeService.fetchEmployee();
                        window.location.reload(true);
                    });
            }
        });
    }

}
