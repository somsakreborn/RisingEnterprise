import {Injectable} from '@angular/core';
import {User} from './users.interface';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class UsersService {

    private headers = new HttpHeaders({'Content-Type': 'application/json'});

    constructor(private http: HttpClient) {
    }

    addUser(user: User) {
        return this.http.post('https://somsakreborn.com:8888/api/v1/user', user, {headers: this.headers});
    }

    fetchUser() {
        return this.http.get<User[]>(`https://somsakreborn.com:8888/api/v1/user`, {headers: this.headers});
    }

    fetchViewUser(user: User) {
        // const httpOptions = {params: new HttpParams({fromObject: {userId: user.userId}), headers: this.headers};
        return this.http.get<User>(`https://somsakreborn.com:8888/api/v1/user/${user.userId}`, {headers: this.headers});
    }

    updateUser(user: User) {
        return this.http.put(`https://somsakreborn.com:8888/api/v1/user`, user, {headers: this.headers});
    }

    deleteUser(user: User) {
        return this.http.delete(`https://somsakreborn.com:8888/api/v1/user/${user.userId}`, {headers: this.headers});
    }

    uploadFile(data: FormData) {
        return this.http.post<any>(`https://somsakreborn.com:8888/api/v1/fileUploadUser`, data);
    }
}
