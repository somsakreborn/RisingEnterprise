import {Injectable} from '@angular/core';
import {Warehouse} from './warehouses.interface';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class WarehousesService {

    private headers = new HttpHeaders({'Content-Type': 'application/json'});

    constructor(private http: HttpClient) {

    }

    addWarehouse(warehouse: Warehouse) {
        return this.http.post('https://somsakreborn.com:8888/api/v1/warehouse', warehouse, {headers: this.headers});
    }

    fetchWarehouse() {
        return this.http.get<Warehouse[]>(`https://somsakreborn.com:8888/api/v1/warehouse`, {headers: this.headers});
    }

    fetchViewWarehouse(warehouse: Warehouse) {
        // const httpOptions = {params: new HttpParams({fromObject: {warehouseId: warehouse.warehouseId}), headers: this.headers};
        return this.http.get<Warehouse>(`https://somsakreborn.com:8888/api/v1/warehouse/${warehouse.warehouseId}`, {headers: this.headers});
    }

    fetchWarehouseDefualt() {
        return this.http.get<Warehouse>(`https://somsakreborn.com:8888/api/v1/warehouse/warehouseDefualt/Status`, {headers: this.headers});
    }

    updateWarehouse(warehouse: Warehouse) {
        return this.http.put(`https://somsakreborn.com:8888/api/v1/warehouse`, warehouse, {headers: this.headers});
    }

    deleteWarehouse(warehouse: Warehouse) {
        return this.http.delete(`https://somsakreborn.com:8888/api/v1/warehouse/${warehouse.warehouseId}`, {headers: this.headers});
    }

    uploadFile(data: FormData) {
        return this.http.post<any>(`https://somsakreborn.com:8888/api/v1/fileUploadWarehouse`, data);
    }

}
