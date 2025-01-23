import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {GraduateStudents} from '@app/shared/types/models/graduate-students';
import {HttpClient} from '@angular/common/http';
import {ApiConfig} from '@app/configs/api.config';

@Injectable({
  providedIn: 'root'
})
export class PostgraduateService {

  constructor(private http: HttpClient) { }

  getGraduateStudents(): Observable<GraduateStudents[]> {
    return this.http.get<GraduateStudents[]>(ApiConfig.department.postgraduate);
  }
}
