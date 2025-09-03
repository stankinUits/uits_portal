import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {EmployeeService} from '@app/views/uits/public/about/employee/employee.service';
import {TeacherAchievements} from '@app/shared/types/models/teacher-achievements';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements-teacher.component.html',
  styleUrls: ['./achievements-teacher.component.scss']
})
export class AchievementsTeacherComponent implements OnInit {
  teacherID: number;
  achievements: TeacherAchievements[] = [];

  constructor(private employeeService: EmployeeService,
              private route: ActivatedRoute,
              private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      this.teacherID = +params.get('id')!;
    });
    this.employeeService.getAchievementsByTeacher(this.teacherID).subscribe(achievements => {
      this.achievements = achievements;
      this.cdr.detectChanges();
      console.log(achievements);
    });
  }
}
