import {Injectable} from '@angular/core';
import {Customer} from './customers.interface';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CustomersService {

    private headers = new HttpHeaders({'Content-Type': 'application/json'});

    constructor(private http: HttpClient) {
    }

    addCustomer(customer: Customer) {
        return this.http.post('https://somsakreborn.com:8888/api/v1/customer', customer, {headers: this.headers});
    }

    fetchCustomer() {
        return this.http.get<Customer[]>(`https://somsakreborn.com:8888/api/v1/customer`, {headers: this.headers});
    }


    fetchViewCustomer(customer: Customer) {
        // const httpOptions = {params: new HttpParams({fromObject: {customerId: customer.customerId}), headers: this.headers};
        return this.http.get<Customer>(`https://somsakreborn.com:8888/api/v1/customer/${customer.customerId}`, {headers: this.headers});
    }

    fetchViewCustomerId(id: number): Observable<any> {
        // const httpOptions = {params: new HttpParams({fromObject: {customerId: customer.customerId}), headers: this.headers};
        return this.http.get<Customer>(`https://somsakreborn.com:8888/api/v1/customer/${id}`, {headers: this.headers});
    }


    updateCustomer(customer: Customer) {
        return this.http.put(`https://somsakreborn.com:8888/api/v1/customer`, customer, {headers: this.headers});
    }

    deleteCustomer(customer: Customer) {
        return this.http.delete(`https://somsakreborn.com:8888/api/v1/customer/${customer.customerId}`, {headers: this.headers});
    }

    uploadFile(data: FormData) {
        return this.http.post<any>(`https://somsakreborn.com:8888/api/v1/fileUploadCustomer`, data);
    }
}
