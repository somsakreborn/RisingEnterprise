import {Injectable} from '@angular/core';
import {Inventory} from './inventory.interface';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class InventoryService {

    private headers = new HttpHeaders({'Content-Type': 'application/json'});

    constructor(private http: HttpClient) {

    }

    addInventory(inventory: Inventory) {
        return this.http.post('https://somsakreborn.com:8888/api/v1/inventory', inventory, {headers: this.headers});
    }

    fetchInventory() {
        return this.http.get<Inventory[]>(`https://somsakreborn.com:8888/api/v1/inventory`, {headers: this.headers});
    }

    fetchViewInventory(inventory: Inventory) {
        // const httpOptions = {params: new HttpParams({fromObject: {inventoryId: inventory.inventoryId}), headers: this.headers};
        return this.http.get<Inventory>(`https://somsakreborn.com:8888/api/v1/inventory/${inventory.inventoryId}`, {headers: this.headers});
    }

    updateInventory(inventory: Inventory) {
        return this.http.put(`https://somsakreborn.com:8888/api/v1/inventory`, inventory, {headers: this.headers});
    }

    deleteInventory(inventory: Inventory) {
        return this.http.delete(`https://somsakreborn.com:8888/api/v1/inventory/${inventory.inventoryId}`, {headers: this.headers});
    }

    uploadFile(data: FormData) {
        return this.http.post<any>(`https://somsakreborn.com:8888/api/v1/fileUploadInventory`, data);
    }

}
