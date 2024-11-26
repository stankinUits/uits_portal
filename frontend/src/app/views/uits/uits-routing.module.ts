import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from '@app/views/uits/public/home/home.component';
import {CustomPageComponent} from '@app/views/uits/public/custom-page/custom-page.component';
import {
  MainSciencePageComponent
} from '@app/views/uits/public/scientific-publications/pages/main-science-page/main-science-page.component';


const routes: Routes = [
  {
    path: 'home', component: HomeComponent
  },
  {
    path: 'about', loadChildren: () => import('@app/views/uits/public/about/about.module').then(m => m.AboutModule),
  },
  {
    path: 'educational-activities',
    loadChildren: () => import('@app/views/uits/public/educational-activities/educational-activities.module')
      .then(m => m.EducationalActivitiesModule),
  },
  {
    path: 'scientific-activities',
    loadChildren: () => import('@app/views/uits/public/scientific-activities/scientific-activities.module')
      .then(m => m.ScientificActivitiesModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('@app/views/uits/private/profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'page/:slug',
    component: CustomPageComponent
  },
  { path: 'scientific-activity-publications', component: MainSciencePageComponent},
  { path: 'scientific-activity-publications/create_new_author', component: MainSciencePageComponent},
  { path: 'scientific-activity-publications/edit_author', component: MainSciencePageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UitsRoutingModule {
}
