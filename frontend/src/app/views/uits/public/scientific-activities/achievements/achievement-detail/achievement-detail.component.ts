import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AchievementService } from '../achievement.service';
import {PagesConfig} from '@app/configs/pages.config';
import {BehaviorSubject} from 'rxjs';
import {Achievement} from '@app/shared/types/models/achievement';
import {AlertService} from '@app/shared/services/alert.service';


@Component({
  selector: 'app-achievement-detail',
  templateUrl: './achievement-detail.component.html',
  styleUrls: ['./achievement-detail.component.scss']
})
export class AchievementDetailComponent implements OnInit {
  achievement$: BehaviorSubject<Achievement> = new BehaviorSubject<Achievement>(null);
  id: number;
  errorMessage: string | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private achievementService: AchievementService,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.route.params.subscribe(params => {
      this.id = +params.id;
      this.getAchievement();
      this.isLoading = false;
    });
  }

  getAchievement() {
    this.achievementService.getAchievementByID(this.id).subscribe({
      next: (achievement) => {
        console.log(achievement);
        this.achievement$.next(achievement);
      },
      error: (error) => {
        this.errorMessage = error;
        this.alertService.add('Произошла ошибка при загрузке данных', 'danger');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/scientific-activities/achievements']);
  }


  redirectToEditPage(): void {
    if (this.id) {
      window.open(PagesConfig.admin + '/achievements/achievement/' + this.id + '/change', '_blank');
    }
  }
}
