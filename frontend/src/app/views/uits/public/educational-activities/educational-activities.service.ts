import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiConfig} from "@app/configs/api.config";

@Injectable({
  providedIn: 'root'
})
export class EducationalActivitiesService {

  constructor(private http: HttpClient) { }

  fetchTeachersWithGraduationExamSchedule() {
    return this.http.get(ApiConfig.department.employee.teacher.exam_schedule.with_graduation);
  }

  fetchTeachersWithNonGraduationExamSchedule() {
    return this.http.get(ApiConfig.department.employee.teacher.exam_schedule.with_non_graduation);
  }
}
