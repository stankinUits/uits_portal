import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfig } from '@app/configs/api.config';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { IEmployee } from '@app/shared/types/models/employee';
import { Schedule } from '@app/shared/types/models/schedule';
import { Subject as Discipline } from '@app/shared/types/models/subject';
import {TeacherAchievements} from '@app/shared/types/models/teacher-achievements';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  teacher$: BehaviorSubject<IEmployee[]>;
  uvp$: BehaviorSubject<IEmployee[]>;

  constructor(private http: HttpClient) {
    this.teacher$ = new BehaviorSubject<IEmployee[]>([]);
    this.uvp$ = new BehaviorSubject<IEmployee[]>([]);
  }

  getAllTeachers() {
    return this.http.get<IEmployee[]>(ApiConfig.department.employee.teacher.info)
      .pipe(
        map(teachers => {
          this.teacher$.next(teachers);
          return teachers;
        })
      );
  }

  getAllEmployees(): Observable<IEmployee[]> {
    return this.http.get<IEmployee[]>(ApiConfig.department.employee.teacher.uvp)
      .pipe(
        map(uvp => {
          this.uvp$.next(uvp);
          return uvp;
        })
      );
  }

  retrieveTeacher(id: number): Observable<IEmployee> {
    return this.http.get<IEmployee>(`${ApiConfig.department.employee.teacher.info}${id}`);
  }

  importSchedule(id: number, scheduleFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', scheduleFile, scheduleFile.name);

    return this.http.post(ApiConfig.department.employee.teacher.schedule.import(id), formData);
  }

  retrieveSchedule(id: number): Observable<Schedule> {
    return this.http.get<Schedule>(ApiConfig.department.employee.teacher.schedule.retrieve(id))
      .pipe(
        map(rawSchedule => Schedule.fromResponse(rawSchedule))
      );
  }

  retrieveDisciplines(teacherId: number): Observable<Discipline[]> {
    return this.http.get<Discipline[]>(ApiConfig.department.employee.teacher.subject.disciplines(teacherId));
  }

  getAchievementsByTeacher(teacherId: number): Observable<TeacherAchievements[]> {
    return this.http.get<TeacherAchievements[]>(ApiConfig.department.employee.teacher.achievements(teacherId));
  }
}
