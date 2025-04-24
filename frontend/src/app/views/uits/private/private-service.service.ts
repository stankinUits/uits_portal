import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiConfig} from "@app/configs/api.config";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PrivateServiceService {

  constructor(private http: HttpClient) {
  }

  getTeacherInfo() {
    return this.http.get(ApiConfig.teacher_user.info)
  }

  updateTeacherInfo(teacherData: any): Observable<any> {
    return this.http.post(ApiConfig.teacher_user.update_teacher_info, teacherData);
  }
}
