import {Injectable} from '@angular/core';
import {Employee, ResponseJson} from './employee.interface';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class EmployeeService {

    private headers = new HttpHeaders({'Content-Type': 'application/json'});

    constructor(private http: HttpClient) {

    }

    addEmployee(employee: Employee) {
        return this.http.post('https://somsakreborn.com:8888/api/v1/employee', employee, {headers: this.headers});
    }

    fetchEmployee() {
        return this.http.get<ResponseJson<Employee[]>>('https://somsakreborn.com:8888/api/v1/employee', {headers: this.headers});
    }

    fetchViewEmployee(employee: Employee) {

        // const httpOptions = {params: new HttpParams({fromObject: {employeeId: employee.employeeId}), headers: this.headers};
        return this.http.get<Employee>(`https://somsakreborn.com:8888/api/v1/employee/${employee.employeeId}`, {headers: this.headers});
    }

    updateEmployee(employee: Employee) {
        return this.http.put(`https://somsakreborn.com:8888/api/v1/employee`, employee, {headers: this.headers});
    }

    deleteEmployee(employee: Employee) {
        return this.http.delete(`https://somsakreborn.com:8888/api/v1/employee/${employee.employeeId}`, {headers: this.headers});
    }
}
