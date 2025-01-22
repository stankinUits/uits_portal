import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EmployeeService} from '@app/views/uits/public/about/employee/employee.service';
import {Subject as Discipline} from '@app/shared/types/models/subject';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-disciplines',
  templateUrl: './disciplines.component.html',
  styleUrls: ['./disciplines.component.css']
})

export class DisciplinesComponent implements OnInit {
  teacherID: number;
  disciplines: Discipline[] = [];

  constructor(private route: ActivatedRoute,
              private employeeService: EmployeeService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.route.parent?.paramMap.subscribe(params => {
      this.teacherID = +params.get('id')!;
      this.employeeService.retrieveDisciplines(this.teacherID).subscribe(disciplines => {
        this.disciplines = disciplines;
        console.log(this.disciplines);
        this.cdr.detectChanges();
      });
    });
  }
}
