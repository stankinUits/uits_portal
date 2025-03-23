import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {
  EducationalActivitiesService
} from "@app/views/uits/public/educational-activities/educational-activities.service";
import {IEmployee} from "@app/shared/types/models/employee";
import {forkJoin} from "rxjs";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-exam-schedule',
  templateUrl: './exam-schedule.component.html',
  styleUrls: ['./exam-schedule.component.css']
})
export class ExamScheduleComponent implements OnInit {
  teachersWithGraduationExam: IEmployee[] = [];
  teachersWithNonGraduationExam: IEmployee[] = [];

  constructor(private educationActivitiesService: EducationalActivitiesService,
              private cdr: ChangeDetectorRef,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.fetchExamSchedule();
  }

  fetchExamSchedule(): void {
    forkJoin({
      graduationTeachers: this.educationActivitiesService.fetchTeachersWithGraduationExamSchedule(),
      nonGraduationTeachers: this.educationActivitiesService.fetchTeachersWithNonGraduationExamSchedule()
    }).subscribe({
      next: (results: { graduationTeachers: IEmployee[], nonGraduationTeachers: IEmployee[] }) => {
        this.teachersWithGraduationExam = results.graduationTeachers;
        this.teachersWithNonGraduationExam = results.nonGraduationTeachers;
        this.cdr.detectChanges();
      }
    })
  }

  getSafeUrl(url: string): SafeResourceUrl {
    try {
      const parsedUrl = new URL(url);
      const allowedHost = 'drive.google.com';

      if (parsedUrl.hostname === allowedHost) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
      } else {
        console.warn('URL отклонён: недопустимый домен', parsedUrl.hostname);
        return '';
      }
    } catch (e) {
      console.warn('Некорректный URL');
      return '';
    }
  }
}
