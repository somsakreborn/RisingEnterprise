import {Injectable} from '@angular/core';
import {Order} from './orders.interface';
import {Report} from './reports.interface';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

    private headers = new HttpHeaders({'Content-Type': 'application/json'});

    constructor(private http: HttpClient) {
    }

    addOrder(order: Order) {
        return this.http.post('https://somsakreborn.com:8888/api/v1/order', order, {headers: this.headers});
    }

    fetchOrder() {
        return this.http.get<Order[]>(`https://somsakreborn.com:8888/api/v1/order`, {headers: this.headers});
    }

    fetchOrderByRangDate(startDate: any, endDate: any): Observable<any> {
        return this.http.get<Order[]>(`https://somsakreborn.com:8888/api/v1/order/date/${startDate}/${endDate}`, {headers: this.headers});
    }

    fetchOrderRangDate(rangDate: any): Observable<any> {
        return this.http.get<Order[]>(`https://somsakreborn.com:8888/api/v1/order/date/${rangDate}`, {headers: this.headers});
    }

    fetchLastOrderId() {
        return this.http.get<Order>(`https://somsakreborn.com:8888/api/v1/orderId`, {headers: this.headers});
    }

    fetchViewOrder(order: Order) {
        // const httpOptions = {params: new HttpParams({fromObject: {orderId: order.orderId}), headers: this.headers};
        return this.http.get<Order>(`https://somsakreborn.com:8888/api/v1/order/${order.orderId}`, {headers: this.headers});
    }

    fetchViewOrderId(id: number): Observable<any> {
        // const httpOptions = {params: new HttpParams({fromObject: {orderId: order.orderId}), headers: this.headers};
        return this.http.get<Order>(`https://somsakreborn.com:8888/api/v1/order/${id}`, {headers: this.headers});
    }

    fetchViewOrderODId(keyword: any): Observable<any> {
        // const httpOptions = {params: new HttpParams({fromObject: {orderId: order.orderId}), headers: this.headers};
        return this.http.get<Order>(`https://somsakreborn.com:8888/api/v1/order/name/${keyword}`, {headers: this.headers});
    }

    updateOrderId(id: number): Observable<any> {
        // const httpOptions = {params: new HttpParams({fromObject: {orderId: order.orderId}), headers: this.headers};
        return this.http.put<Order>(`https://somsakreborn.com:8888/api/v1/order/${id}`, {headers: this.headers});
    }

    updateOrder(order: Order) {
        // return this.http.put<Order>(`https://somsakreborn.com:8888/api/v1/order`, order, {headers: this.headers});
        return this.http.put<Order>(`https://somsakreborn.com:8888/api/v1/order`, order, {headers: this.headers});
    }

    deleteOrder(id: number): Observable<any> {
        return this.http.delete(`https://somsakreborn.com:8888/api/v1/order/${id}`, {headers: this.headers});
        // return this.http.delete<Order>(`https://somsakreborn.com:8888/api/v1/order/${order.orderId}`, {headers: this.headers});
    }

    uploadFile(data: FormData) {
        return this.http.post<any>(`https://somsakreborn.com:8888/api/v1/fileUploadOrderPayment`, data);
    }

    // report dashboard //
    fetchDashboardYearly(rangYearly: any): Observable<any> {
        return this.http.get<any>(`https://somsakreborn.com:8888/api/v1/dashboard/yearly/${rangYearly}`, {headers: this.headers});
    }
    fetchDashboardMonthly(rangMonthly: any): Observable<any> {
        return this.http.get<any>(`https://somsakreborn.com:8888/api/v1/dashboard/monthly/${rangMonthly}`, {headers: this.headers});
    }
    fetchDashboardMonthlySale(rangSaleMonthly: any): Observable<any> {
        return this.http.get<any>(`https://somsakreborn.com:8888/api/v1/dashboard/monthly-sale/${rangSaleMonthly}`, {headers: this.headers});
    }
    fetchDashboardYearlySale(rangSaleYearly: any): Observable<any> {
        return this.http.get<any>(`https://somsakreborn.com:8888/api/v1/dashboard/yearly-sale/${rangSaleYearly}`, {headers: this.headers});
    }
    // report dashboard //
}
