import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppserverService {

  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  // private baseUrl = `https://somsakreborn.com:8888/`;  // don't use local in case of cross domain or ip address
  private baseUrl = `https://somsakreborn.com:8888/`;  // don't use local in case of cross domain or ip address
  private apiUrl = `${this.baseUrl}api/v1`;
  private registerUrl = `${this.apiUrl}/register`;
  private loginUrl = `${this.apiUrl}/login`;
  private loginUrlName = `${this.apiUrl}/login/name`;
  private logoutUrl = `${this.apiUrl}/logout`;
  // private dashboardUrl = `${this.apiUrl}/dashboard`;
  // private expanseUrl = `${this.apiUrl}/expanse`;
  // private addemployeeUrl = `${this.apiUrl}/employee/create`;
  // private employeeUrl = `${this.apiUrl}/employee`;

  constructor(private http: HttpClient) {
  }

  // any คำใดๆก็ได้
  addUser(data): Observable<any> {
    return this.http.post<any>(this.registerUrl, data, {headers: this.headers});
  }

  login(credentail): Observable<any> {
    return this.http.post<any>(this.loginUrl, credentail, {headers: this.headers});
  }

  logout(): Observable<void> {
    return this.http.get<void>(this.logoutUrl, {headers: this.headers});
  }


}
