import {Injectable} from '@angular/core';
import {Shipment} from './shipments.interface';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable(
    {
        providedIn: 'root'
    }
)
export class ShipmentService {

    private headers = new HttpHeaders({'Content-Type': 'application/json'});

    constructor(private http: HttpClient) {

    }

    addShipment(shipment: Shipment) {
        return this.http.post('https://somsakreborn.com:8888/api/v1/shipment', shipment, {headers: this.headers});
    }

    fetchShipment() {
        return this.http.get<Shipment[]>(`https://somsakreborn.com:8888/api/v1/shipment`, {headers: this.headers});
    }

    fetchViewShipment(shipment: Shipment) {
        // const httpOptions = {params: new HttpParams({fromObject: {shipmentId: shipment.shipmentId}), headers: this.headers};
        return this.http.get<Shipment>(`https://somsakreborn.com:8888/api/v1/shipment/${shipment.shipmentId}`, {headers: this.headers});
    }

    updateShipment(shipment: Shipment) {
        return this.http.put(`https://somsakreborn.com:8888/api/v1/shipment`, shipment, {headers: this.headers});
    }

    deleteShipment(shipment: Shipment) {
        return this.http.delete(`https://somsakreborn.com:8888/api/v1/shipment/${shipment.shipmentId}`, {headers: this.headers});
    }

    uploadFile(data: FormData) {
        return this.http.post<any>(`https://somsakreborn.com:8888/api/v1/fileUploadShipment`, data);
    }

}
