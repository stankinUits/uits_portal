import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiConfig} from "@app/configs/api.config";

@Injectable({
  providedIn: 'root'
})
export class PrivateServiceService {

  constructor(private http: HttpClient) { }

  getTeacherInfo() {
    return this.http.get(ApiConfig.teacher_user.info)
  }
}
