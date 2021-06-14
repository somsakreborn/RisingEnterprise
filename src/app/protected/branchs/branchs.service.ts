import {Injectable} from '@angular/core';
import {Branch} from './branchs.interface';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class BranchService {

  private headers = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {

  }

  addBranch(branch: Branch) {
    return this.http.post('https://somsakreborn.com:8888/api/v1/branch', branch, {headers: this.headers});
  }

  fetchBranch() {
    return this.http.get<Branch[]>(`https://somsakreborn.com:8888/api/v1/branch`, {headers: this.headers});
  }

  fetchViewBranch(branch: Branch) {
    // const httpOptions = {params: new HttpParams({fromObject: {branchId: branch.branchId}), headers: this.headers};
    return this.http.get<Branch>(`https://somsakreborn.com:8888/api/v1/branch/${branch.branchId}`, {headers: this.headers});
  }

  updateBranch(branch: Branch) {
    return this.http.put(`https://somsakreborn.com:8888/api/v1/branch`, branch, {headers: this.headers});
  }

  deleteBranch(branch: Branch) {
    return this.http.delete(`https://somsakreborn.com:8888/api/v1/branch/${branch.branchId}`, {headers: this.headers});
  }

  uploadFile(data: FormData) {
    return this.http.post<any>(`https://somsakreborn.com:8888/api/v1/fileUploadBranch`, data);
  }
}
