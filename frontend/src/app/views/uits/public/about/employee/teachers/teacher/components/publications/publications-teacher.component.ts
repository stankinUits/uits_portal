import {Component, OnInit} from '@angular/core';
import {EmployeeService} from "@app/views/uits/public/about/employee/employee.service";
import {BehaviorSubject} from "rxjs";
import {IEmployee} from "@app/shared/types/models/employee";
import {ActivatedRoute} from "@angular/router";
import {ScienceReadyPublication} from "@app/views/uits/public/scientific-publications/interface/profile.interface";
import {
  RegisterScienceService
} from "@app/views/uits/public/scientific-publications/service/register-science-service.service";
import {AppSettings} from "@app/views/uits/public/scientific-publications/utils/settings";

@Component({
  selector: 'app-publications',
  templateUrl: './publications-teacher.component.html',
  styleUrls: ['./publications-teacher.component.css']
})
export class PublicationsTeacherComponent implements OnInit {
  teacherID: number;
  teacher$: BehaviorSubject<IEmployee> = new BehaviorSubject(null);
  publications$: BehaviorSubject<ScienceReadyPublication[]> = new BehaviorSubject([]);
  tagsMap: Map<string, string> = new Map();

  constructor(private employeeService: EmployeeService,
              private route: ActivatedRoute,
              private scienceService: RegisterScienceService) {
  }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      this.teacherID = +params.get('id')!;
      this.employeeService.retrieveTeacher(this.teacherID).subscribe(teacher => {
        this.teacher$.next(teacher);
        this.getTags();
        this.getPublications(`${teacher.last_name} ${teacher.first_name} ${teacher.patronymic}`);
      });
    });
  }

  getPublications(name: string): void {
    this.employeeService.getPublicationsByAuthorName(name).subscribe(publications => {
      this.publications$.next(publications);
    })
  }

  getTags() {
    this.scienceService.getALLTags().subscribe(tags => {
      tags.forEach(tag => {
        this.tagsMap.set(tag.name, AppSettings.DEFAULT_TAG_STYLE)
      });
    })
  }
}
