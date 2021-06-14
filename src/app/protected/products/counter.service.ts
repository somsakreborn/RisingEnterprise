import {Injectable} from '@angular/core';
import {Counter} from './counter.interface';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class CounterService {

    private headers = new HttpHeaders({'Content-Type': 'application/json'});

    constructor(private http: HttpClient) {

    }

    // ค้นหา เพื่อ-สร้าง CategoryId ตอน Create Category//
    fetchCounterCategory() {
        return this.http.get<Counter>(`https://somsakreborn.com:8888/api/v1/counter/categoryId`, {headers: this.headers});
    }

    // ค้นหา เพื่อ-สร้าง CustomerId ตอน Create Customer//
    fetchCounterCustomer() {
        return this.http.get<Counter>(`https://somsakreborn.com:8888/api/v1/counter/customerId`, {headers: this.headers});
    }

    // ค้นหา เพื่อ-สร้าง OrderId ตอน Create Order//
    fetchCounterOrder() {
        return this.http.get<Counter>(`https://somsakreborn.com:8888/api/v1/counter/orderId`, {headers: this.headers});
    }

}
