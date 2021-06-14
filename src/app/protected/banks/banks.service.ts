import {Injectable} from '@angular/core';
import {Bank} from './banks.interface';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable(
    {
    providedIn: 'root'
    }
)
export class BankService {

    private headers = new HttpHeaders({'Content-Type': 'application/json'});

    constructor(private http: HttpClient) {

    }

    addBank(bank: Bank) {
        return this.http.post(`https://somsakreborn.com:8888/api/v1/bank`, bank, {headers: this.headers});
    }

    fetchBank() {
        return this.http.get<Bank[]>(`https://somsakreborn.com:8888/api/v1/bank`, {headers: this.headers});
    }

    fetchViewBank(bank: Bank) {
        // const httpOptions = {params: new HttpParams({fromObject: {bankId: bank.bankId}), headers: this.headers};
        return this.http.get<Bank>(`https://somsakreborn.com:8888/api/v1/bank/${bank.bankId}`, {headers: this.headers});
    }

    updateBank(bank: Bank) {
        return this.http.put(`https://somsakreborn.com:8888/api/v1/bank`, bank, {headers: this.headers});
    }

    deleteBank(bank: Bank) {
        return this.http.delete(`https://somsakreborn.com:8888/api/v1/bank/${bank.bankId}`, {headers: this.headers});
    }

    uploadFile(data: FormData) {
        return this.http.post<any>(`https://somsakreborn.com:8888/api/v1/fileUploadBank`, data);
    }

}
