import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { IEmployee } from '@app/shared/types/models/employee';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { Subject as Discipline } from '@app/shared/types/models/subject';
import { EmployeeService } from '@app/views/uits/public/about/employee/employee.service';
import { AuthService } from '@app/shared/services/auth.service';
import { AlertService } from '@app/shared/services/alert.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { PagesConfig } from '@app/configs/pages.config';

@Component({
  selector: 'app-disciplines',
  templateUrl: './discipline.component.html', // Убедитесь, что путь правильный
  styleUrls: ['./discipline.component.css']
})
export class DisciplinesComponent implements OnInit, OnDestroy {

  teacherId: number;
  private destroy$ = new Subject<void>();

  @Input() teacher: IEmployee;

  selectedDisciplineFile: File = null;

  disciplines: BehaviorSubject<Discipline[]>;

  modalRef: BsModalRef;
  @ViewChild('confirmImportDisciplines') confirmImportDisciplines: TemplateRef<any>;

  get profile() {
    return this.authService.profile$
  }

  constructor(private route: ActivatedRoute,
              private employeeService: EmployeeService,
              private authService: AuthService,
              private alertService: AlertService,
              private modalService: BsModalService) {
    this.disciplines = new BehaviorSubject<Discipline[]>(null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.refreshDisciplines();
  }

  refreshDisciplines() {
    this.route.params.subscribe(params => {
      this.teacherId = +params['id'];
      this.employeeService.retrieveTeacher(this.teacherId).subscribe(teacher => {
        this.teacher = teacher;
      });
    });
    this.employeeService.retrieveDisciplines(this.teacherId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(disciplines => {
        this.disciplines.next(disciplines);
      });
  }

  onDisciplineFileSelected($event: Event) {
    // @ts-ignore
    this.selectedDisciplineFile = <File>$event.target.files[0];
    console.log(this.selectedDisciplineFile);

    this.openModal(this.confirmImportDisciplines);
  }

  importDisciplinesFromSelectedFile() {
    if (this.modalRef) this.modalRef.hide();
    this.employeeService.importDisciplines(this.teacherId, this.selectedDisciplineFile)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          console.log(response);
          this.alertService.add("Дисциплины успешно импортированы");
          this.refreshDisciplines();
        },
        error: error => {
          console.log(error);
          this.alertService.add("Ошибка. Возможно неверный формат файла.", 'danger');
        }
      });
  }

  cancelImportDisciplines() {
    this.modalRef.hide();
    this.selectedDisciplineFile = null;
  }

  navigateToDisciplineEdit() {
    if (this.disciplines.getValue()) {
      window.open(`${PagesConfig.admin}/disciplines/disciplinedit/?teacher_id=${this.teacherId}`);
    } else {
      window.open();
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
