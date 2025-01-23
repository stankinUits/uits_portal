import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { CorporateComponent } from './private/profile/corp/corp.component';
import { HomeComponent } from '@app/views/uits/public/home/home.component';
import { CustomPageComponent } from '@app/views/uits/public/custom-page/custom-page.component';
// import { PersonalComponent } from './private/profile/personal/personal.component'; // Импорт компонента Personal
// import { EventsComponent } from './private/profile/events/events.component';
import { DisciplinesComponent } from '@app/views/uits/public/about/employee/teachers/teacher/components/disciplines/disciplines.component';
import {CorporateModule} from "@app/views/uits/private/profile/corp/corp.module";


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
    path: 'page/:slug',
    component: CustomPageComponent
  },
  {
    path: 'corp',
    loadChildren: () => import('@app/views/uits/private/profile/corp/corp.module').then(m => m.CorporateModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UitsRoutingModule {}
