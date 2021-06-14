import {Injectable} from '@angular/core';
import {Category} from './catagory.interface';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class CategoryService {

    private headers = new HttpHeaders({'Content-Type': 'application/json'});

    constructor(private http: HttpClient) {

    }

    addCategory(category: Category) {
        return this.http.post('https://somsakreborn.com:8888/api/v1/category', category, {headers: this.headers});
    }

    fetchCategory() {
        return this.http.get<Category[]>(`https://somsakreborn.com:8888/api/v1/category`, {headers: this.headers});
    }

    fetchViewCategory(category: Category) {
        // const httpOptions = {params: new HttpParams({fromObject: {categoryId: category.categoryId}), headers: this.headers};
        return this.http.get<Category>(`https://somsakreborn.com:8888/api/v1/category/${category.categoryId}`, {headers: this.headers});
    }

    updateCategory(category: Category) {
        return this.http.put(`https://somsakreborn.com:8888/api/v1/category`, category, {headers: this.headers});
    }

    deleteCategory(category: Category) {
        return this.http.delete(`https://somsakreborn.com:8888/api/v1/category/${category.categoryId}`, {headers: this.headers});
    }

    uploadFile(data: FormData) {
        return this.http.post<any>(`https://somsakreborn.com:8888/api/v1/fileUploadCategory`, data);
    }

}
