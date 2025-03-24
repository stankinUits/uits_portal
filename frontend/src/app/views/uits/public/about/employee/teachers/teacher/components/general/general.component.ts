import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EmployeeService} from '@app/views/uits/public/about/employee/employee.service';
import {BehaviorSubject} from 'rxjs';
import {IEmployee} from '@app/shared/types/models/employee';
import {AVATAR_DEFAULT_URL} from '@app/configs/app.config';
import {TeacherDegree, TeacherRank} from '@app/views/uits/public/about/employee/teachers/teachers.models';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {
  teacherID: number;
  teacher$: BehaviorSubject<IEmployee>;

  constructor(private route: ActivatedRoute,
              private employeeService: EmployeeService,) {
    this.teacher$ = new BehaviorSubject(null);
  }

  get avatar() {
    const teacher = this.teacher$.getValue();
    return (!teacher.avatar) ? AVATAR_DEFAULT_URL : teacher.avatar;
  }

  get fullName() {
    const teacher = this.teacher$.getValue();
    if (teacher.patronymic) {
      return `${teacher.last_name} ${teacher.first_name} ${teacher.patronymic}`;
    } else {
      return `${teacher.last_name} ${teacher.first_name}`;
    }
  }

  get shortName() {
    const teacher = this.teacher$.getValue();
    return `${teacher.last_name} ${teacher.first_name[0]}. ${teacher.patronymic ? teacher.patronymic[0] + '.' : ''}`;
  }

  get position() {
    return this.teacher$.getValue().position;
  }

  get degree() {
    return TeacherDegree[this.teacher$.getValue().degree];
  }

  get rank() {
    return TeacherRank[this.teacher$.getValue().rank];
  }

  get professional_experience() {
    return this.teacher$.getValue().professional_experience;
  }

  get experience() {
    return this.teacher$.getValue().experience;
  }

  get education() {
    return this.teacher$.getValue().education.split('\n');
  }

  get qualification() {
    return this.teacher$.getValue().qualification;
  }

  get bio() {
    return this.teacher$.getValue().bio;
  }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      this.teacherID = +params.get('id')!;
      this.employeeService.retrieveTeacher(this.teacherID).subscribe(teacher => {
        this.teacher$.next(teacher);
      });
    });
  }
}
