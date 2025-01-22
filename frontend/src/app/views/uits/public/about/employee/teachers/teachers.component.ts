import {Component, OnInit} from '@angular/core';
import {EmployeeService} from '@app/views/uits/public/about/employee/employee.service';
import {IEmployee} from '@app/shared/types/models/employee';
import {TeacherDegree, TeacherRank} from '@app/views/uits/public/about/employee/teachers/teachers.models';
import {Router} from '@angular/router';
import {PagesConfig} from '@app/configs/pages.config';
import {AuthService} from '@app/shared/services/auth.service';
import {Permission} from '@app/shared/types/permission.enum';
import {AVATAR_DEFAULT_URL} from '@app/configs/app.config';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss']
})

export class TeachersComponent implements OnInit {
  protected readonly Permission = Permission;
  protected readonly AVATAR_DEFAULT_URL = AVATAR_DEFAULT_URL;

  constructor(private employeeService: EmployeeService,
    private router: Router,
    public authService: AuthService) {}

    get teacher$() {
      return this.employeeService.teacher$;
    }

    ngOnInit(): void {
      this.getAllTeachers();
    }

    getAllTeachers() {
      this.employeeService.getAllTeachers().subscribe();
    }

    teacher(id: number) {
      return this.teacher$.getValue().find(p => p.id === id);
    }

    onCreateTeacher() {
      window.open(`${PagesConfig.admin}/teacher/add/`);
    }

    onEditTeacher(id: any) {
      window.open(`${PagesConfig.admin}/employee/teacher/${id}/change/`);
    }

    basePositions: TeacherRank[] = [
      TeacherRank.Assistant, TeacherRank.Teacher, TeacherRank.HighTeacher, TeacherRank.Reader, TeacherRank.Proffesor
    ];

    moveToEmployee(id: number) {
      console.log('Navigating to:', PagesConfig.about.employee.teachers, id);
      this.router.navigate([PagesConfig.about.employee.teachers, id]);
    }

    getEmployeePositions(employee: IEmployee): string {
      // return {{ employee.degree ? employee.position + ',' : employee.position }}
      // {{ employee.rank ? employee.degree + ',' : employee.degree }} {{ employee.rank }};
      const positions =
        [employee.position, employee.degree ?
          TeacherDegree[employee.degree] : undefined, employee.rank ?
          TeacherRank[employee.rank] : undefined].filter(item => item); // without undefined
      return positions.join(', ');
    }
  }
