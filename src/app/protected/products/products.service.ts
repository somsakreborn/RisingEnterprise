import {Injectable} from '@angular/core';
import {Product} from './products.interface';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductsService {

    private headers = new HttpHeaders({'Content-Type': 'application/json'});

    constructor(private http: HttpClient) {

    }

    // serverAPI: 'https://somsakreborn.com:8888/',
    baseUrl = `${environment.serverAPI}/api/v1/product`;

    addProduct(product: Product) {
        return this.http.post('https://somsakreborn.com:8888/api/v1/product', product, {headers: this.headers});
    }

    fetchProduct() {
        return this.http.get<Product[]>(`https://somsakreborn.com:8888/api/v1/product`, {headers: this.headers});
    }

    fetchViewProduct(product: Product) {
        // const httpOptions = {params: new HttpParams({fromObject: {productId: product.productId}), headers: this.headers};
        return this.http.get<Product>(`https://somsakreborn.com:8888/api/v1/product/${product.productId}`, {headers: this.headers});
    }

    fetchViewProductId(id: number): Observable<any> {
        return this.http.get<Product>(`https://somsakreborn.com:8888/api/v1/product/${id}`, {headers: this.headers});
    }

    fetchViewProductWarehouse(product: Product) {
        // const httpOptions = {params: new HttpParams({fromObject: {productId: product.productId}), headers: this.headers};
        return this.http.get<Product>(`https://somsakreborn.com:8888/api/v1/productwarehouse/${product.warehouseId}`, {headers: this.headers});
    }

    updateProduct(product: Product) {
        return this.http.put(`https://somsakreborn.com:8888/api/v1/product`, product, {headers: this.headers});
    }

    deleteProduct(product: Product) {
        return this.http.delete(`https://somsakreborn.com:8888/api/v1/product/${product.productId}`, {headers: this.headers});
    }

    uploadFile(data: FormData) {
        return this.http.post<any>(`https://somsakreborn.com:8888/api/v1/fileUploadProduct`, data);
    }

    findByName(product: Product) {
        // return this.http.get(`${this.baseUrl}/get_by_name`, {
        // return this.http.get(`https://somsakreborn.com:8888/api/v1/product/name/`, {
        //     params: { query: product }
        // });
        return this.http.get<Product[]>(`https://somsakreborn.com:8888/api/v1/product/name/${product}`, {headers: this.headers});
    }

    fetchViewProductCodename(codename: string): Observable<any> {
        return this.http.get<Product>(`https://somsakreborn.com:8888/api/v1/product/codename/${codename}`, {headers: this.headers});
    }

    hold(id, hold) {
        return this.http.get(`https://somsakreborn.com:8888/api/v1/product/${id}/hold/${hold}`, {headers: this.headers});
    }

    updateHold(id: number, hold: number): Observable<any> {
    // return this.http.put<Product>(`https://somsakreborn.com:8888/api/v1/product/${id}/hold/${hold}`, {headers: this.headers});
        return this.http.put(`https://somsakreborn.com:8888/api/v1/product/${id}/hold/${hold}`, {headers: this.headers});
    }

    updateStock(id, stock) {
        return this.http.post(`https://somsakreborn.com:8888/api/v1/product/${id}/updateStock`, stock, {headers: this.headers});
    }
}
