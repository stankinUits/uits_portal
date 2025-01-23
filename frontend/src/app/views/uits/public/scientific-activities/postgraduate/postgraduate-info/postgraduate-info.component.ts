import {AfterViewInit, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PostgraduateService} from '@app/views/uits/public/scientific-activities/postgraduate.service';
import {GraduateStudents} from '@app/shared/types/models/graduate-students';

@Component({
  selector: 'app-postgraduate-info',
  templateUrl: './postgraduate-info.component.html',
  styleUrls: ['./postgraduate-info.component.css']
})
export class PostgraduateInfoComponent implements OnInit, AfterViewInit {
  @ViewChild('indexColumnTemplate', {static: true}) indexColumnTemplate: TemplateRef<any>;

  students: GraduateStudents[] = [];
  rows = [];
  copy = [];
  columns = [];

  constructor(private service: PostgraduateService,
              private cdr: ChangeDetectorRef,) {
  }

  ngOnInit(): void {
    this.service.getGraduateStudents().subscribe(data => {
      this.students = data;
      this.rows = data;
      this.copy = data;
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    this.columns = [
      {name: '№', cellTemplate: this.indexColumnTemplate, sortable: false},
      {name: 'Студент', prop: 'student.full_name'},
      {name: 'Тема диплома', prop: 'student.diploma_theme'},
      {name: 'Специальность', prop: 'student.speciality'},
      {name: 'Год поступления', prop: 'student.admission_year'},
      {name: 'Преподаватель', prop: 'teacher.full_name'},
    ];
  }

  search(query: string) {
    if (!query) {
      this.rows = this.copy;
    } else {
      const lowerQuery = query.toLowerCase();
      this.rows = this.copy.filter(item =>
        item.student.full_name.toLowerCase().includes(lowerQuery.toLowerCase()) ||
        item.student.diploma_theme.toLowerCase().includes(lowerQuery.toLowerCase()) ||
        item.student.speciality.toLowerCase().includes(lowerQuery.toLowerCase()) ||
        item.student.admission_year.toString().toLowerCase().includes(lowerQuery.toLowerCase()) ||
        item.teacher.full_name.toLowerCase().includes(lowerQuery.toLowerCase())
      );
    }
  }

  indexComparator(a: any, b: any) {
    return a - b;
  }
}
