import { RouterModule, Routes } from '@angular/router';

import { AchievementDetailComponent } from './achievements/achievement-detail/achievement-detail.component';
import { AchievementListComponent } from './achievements/achievement-list/achievement-list.component';
import { NgModule } from '@angular/core';

const routes: Routes = [

  // deprecated
  // { path: 'postgraduate/dissertations', component: PostgraduateDissertationsComponent},
  // { path: 'postgraduate/specialties', component: PostgraduateSpecialtiesComponent},
  // { path: 'postgraduate/practices', component: PostgraduatePracticesComponent},
  // { path: 'conferences', component: ConferencesComponent},
  // { path: 'publications', component: PublicationsComponent},
  // { path: 'scientific-work', component: ScientificWorkComponent},
  { path: 'achievements', component: AchievementListComponent },
  { path: 'achievements/:id', component: AchievementDetailComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScientificActivitiesRoutingModule { }
