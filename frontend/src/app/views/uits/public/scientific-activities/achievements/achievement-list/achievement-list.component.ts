import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { AchievementService } from '../achievement.service';

import { AuthService } from '@app/shared/services/auth.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-achievement-list',
  templateUrl: './achievement-list.component.html',
  styleUrls: ['./achievement-list.component.scss'],
})
export class AchievementListComponent implements OnInit {
  achievements: any[] = [];

  isLoading = true;
  errorMessage: string | null = null;
  isAdmin = false;

  constructor(
    private achievementService: AchievementService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkAdminRights();

    this.fetchAchievements();
  }

  checkAdminRights(): void {
    this.authService.canEdit().subscribe((canEdit: boolean) => {

      this.isAdmin = canEdit;
      this.cdr.detectChanges();

    });
  }

  fetchAchievements(): void {
    this.achievementService.getAchievements().subscribe({
      next: (data: any) => {
        // Check if `data` has `results`; otherwise, treat it as an array
        this.achievements = Array.isArray(data) ? data : data.results || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = error.message || 'An error occurred while fetching achievements.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  reloadPage(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.fetchAchievements();
  }

  onSelectAchievement(achievement: any): void {
    this.router.navigate([
      '/scientific-activities/achievements',
      achievement.id,
    ]);
  }


  redirectToAdminPanel(): void {
    window.open('http://127.0.0.1:8000/admin/achievements/achievement/', '_blank');
  }

}
