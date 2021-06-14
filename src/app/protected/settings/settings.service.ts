import {Injectable} from '@angular/core';
import {Pixel} from './settings.interface';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    private headers = new HttpHeaders({'Content-Type': 'application/json'});

    constructor(private http: HttpClient) {

    }

    addPixel(pixel: Pixel) {
        return this.http.post('https://somsakreborn.com:8888/api/v1/pixel', pixel, {headers: this.headers});
    }

    fetchPixel() {
        return this.http.get<Pixel[]>(`https://somsakreborn.com:8888/api/v1/pixel`, {headers: this.headers});
    }

    fetchViewPixel(pixel: Pixel) {
        // return this.http.get<Pixel>(`https://somsakreborn.com:8888/api/v1/pixel/${pixel.pixelId}`, {headers: this.headers});
        return this.http.get<Pixel>(`https://somsakreborn.com:8888/api/v1/pixel/${pixel}`, {headers: this.headers});
    }

    updatePixel(pixel: Pixel) {
        return this.http.put(`https://somsakreborn.com:8888/api/v1/pixel`, pixel, {headers: this.headers});
    }

    deletePixel(pixel: Pixel) {
        // return this.http.delete(`https://somsakreborn.com:8888/api/v1/pixel/${pixel.pixelId}`, {headers: this.headers});
        return this.http.delete(`https://somsakreborn.com:8888/api/v1/pixel/${pixel}`, {headers: this.headers});
    }

    uploadFile(data: FormData) {
        return this.http.post<any>(`https://somsakreborn.com:8888/api/v1/fileUploadPixel`, data);
    }

}
