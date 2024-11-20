import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-achievement-detail',
  templateUrl: './achievement-detail.component.html',
  styleUrls: ['./achievement-detail.component.scss']
})
export class AchievementDetailComponent implements OnInit {

  achievement: any; // This will hold the achievement data

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // Get the achievement data from the route state
    this.achievement = history.state.achievement;
    console.log(this.achievement); // You can log to verify the data is coming through
  }

  goBack(): void {
    // Navigate to the achievement list
    this.router.navigate(['/scientific-activities/achievements']);
  }
}
