export interface Employee {

    index: number;
    employeeId: number;
    employeeName: string;
    employeeSurname: string;
    employeePosition: string;
    employeeEmail: string;
    employeeBranch: string;
    employeeAge: number;
    employeeSalary: number;
    employeeGender: string;
    employeeComment: string;
    employeeStartDate: Date;
    employeeCreated: Date;
}

export interface ResponseJson<T> {
    tableHeader: Object;
    result: T;
}
