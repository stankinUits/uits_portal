import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PostgraduateService} from '@app/views/uits/public/scientific-activities/postgraduate.service';
import {GraduateStudents} from '@app/shared/types/models/graduate-students';

@Component({
  selector: 'app-postgraduate-info',
  templateUrl: './postgraduate-info.component.html',
  styleUrls: ['./postgraduate-info.component.css']
})
export class PostgraduateInfoComponent implements OnInit {
  students: GraduateStudents[] = [];

  constructor(private service: PostgraduateService,
              private cdr: ChangeDetectorRef,) { }

  ngOnInit(): void {
    this.service.getGraduateStudents().subscribe(data => {
      this.students = data;
      this.cdr.detectChanges();
    });
  }
}
