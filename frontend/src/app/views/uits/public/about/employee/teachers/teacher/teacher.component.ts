import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {IEmployee} from '@app/shared/types/models/employee';
import {BehaviorSubject} from 'rxjs';
import {EmployeeService} from '@app/views/uits/public/about/employee/employee.service';
import {TeacherDegree, TeacherRank} from "@app/views/uits/public/about/employee/teachers/teachers.models";

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent implements OnInit {
  id: number;
  teacher$: BehaviorSubject<IEmployee>;

  get fullName() {
    const teacher = this.teacher$.getValue();
    if (teacher.patronymic) {
      return `${teacher.last_name} ${teacher.first_name} ${teacher.patronymic}`;
    } else {
      return `${teacher.last_name} ${teacher.first_name}`;
    }
  }

  get avatar() {
    const teacher = this.teacher$.getValue();
    return teacher.avatar ? teacher.avatar : ''
  }

  get position() {
     const teacher = this.teacher$.getValue();
     return teacher.position ? `${teacher.position} кафедры управления и информатики в технических системах` : ''
  }

  get degree() {
    const teacher = this.teacher$.getValue();
    return teacher.degree ? TeacherDegree[teacher.degree] : '';
  }

  get rank() {
    const teacher = this.teacher$.getValue();
    return teacher.rank ? TeacherRank[teacher.rank] : '';
  }

  get email() {
    const teacher = this.teacher$.getValue();
    return teacher.email ? `mailto:${teacher.email}` : '';
  }

  get tel() {
    const teacher = this.teacher$.getValue();
    return teacher.phone_number ? `tel:${teacher.phone_number}` : '';
  }

  get messanger() {
    const teacher = this.teacher$.getValue();
    return teacher.messenger ? teacher.messenger : '';
  }

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
  ) {
    this.teacher$ = new BehaviorSubject(null);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params.id;
      this.employeeService.retrieveTeacher(this.id).subscribe(teacher => {
        this.teacher$.next(teacher);
      });
    });
  }
}
