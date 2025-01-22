import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {IEmployee} from '@app/shared/types/models/employee';
import {BehaviorSubject} from 'rxjs';
import {EmployeeService} from '@app/views/uits/public/about/employee/employee.service';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {
  id: number;
  teacher$: BehaviorSubject<IEmployee>;

  get fullName() {
    const teacher = this.teacher$.getValue();
    return `${teacher.last_name} ${teacher.first_name} ${teacher.patronymic}`;
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
      console.log('Params:', this.id);
      this.employeeService.retrieveTeacher(this.id).subscribe(teacher => {
        this.teacher$.next(teacher);
      });
    });
  }
}
