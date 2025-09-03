import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EmployeeService} from '@app/views/uits/public/about/employee/employee.service';
import {Subject as Discipline} from '@app/shared/types/models/subject';
import {ChangeDetectorRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {
  DetailsModalComponent
} from '@app/views/uits/public/about/employee/teachers/teacher/components/disciplines/details-modal/details-modal.component';


@Component({
  selector: 'app-disciplines',
  templateUrl: './disciplines.component.html',
  styleUrls: ['./disciplines.component.scss']
})

export class DisciplinesComponent implements OnInit {
  teacherID: number;
  disciplines: Discipline[] = [];
  bsModalRef: BsModalRef;

  constructor(private route: ActivatedRoute,
              private employeeService: EmployeeService,
              private cdr: ChangeDetectorRef,
              private modalService: BsModalService) {
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

  openModalWithComponent(name: string, description: string) {
    if (description) {
      const initialState = {
        description,
        name
      };
      this.bsModalRef = this.modalService.show(DetailsModalComponent, {initialState});
      this.bsModalRef.content.closeBtnName = 'Close';
    } else {
      return;
    }
  }
}
