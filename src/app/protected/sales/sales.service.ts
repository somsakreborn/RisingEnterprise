import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ReportsService {

    private headers = new HttpHeaders({'Content-Type': 'application/json'});

    constructor(private http: HttpClient) {
    }

    // fetchOrder() {
    //     return this.http.get<Order[]>(`https://somsakreborn.com:8888/api/v1/order`, {headers: this.headers});
    // }

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

    // report salse-users //
    fetchReportSalesUsersAmount(rangeUserAmount: any): Observable<any> {
        return this.http.get<any>(`https://somsakreborn.com:8888/api/v1/report/users/${rangeUserAmount}`, {headers: this.headers});
    }
    // report salse-users //
    // report salse-channels //
    fetchReportSalesChannelsAmount(rangeChannelAmount: any): Observable<any> {
        return this.http.get<any>(`https://somsakreborn.com:8888/api/v1/report/channels/${rangeChannelAmount}`, {headers: this.headers});
    }
    // report salse-channels //
    // report salse-products //
    fetchReportSalesProductsAmount(rangeProductAmount: any) {
        return this.http.get<any>(`https://somsakreborn.com:8888/api/v1/report/products/${rangeProductAmount}`, {headers: this.headers});
    }
    // report salse-products //
}
