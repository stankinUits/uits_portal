import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CorporateComponent } from './private/profile/corp/corp.component';
import { HomeComponent } from '@app/views/uits/public/home/home.component';
import { CustomPageComponent } from '@app/views/uits/public/custom-page/custom-page.component';
import { PersonalComponent } from './private/profile/personal/personal.component'; // Импорт компонента Personal
import { EventsComponent } from './private/profile/events/events.component';
import { DisciplinesComponent } from '@app/views/uits/public/about/employee/teachers/teacher/components/disciplines/disciplines.component';

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
    path: 'corp',
    component: CorporateComponent, 
    children: [
      {
        path: 'page/:slug',
        component: CustomPageComponent
      },
      {
        path: 'personal', // Изменяем 'profile' на 'personal'
        component: PersonalComponent, // Подключаем PersonalComponent напрямую
      },
      {
        path: 'calendar',
        component: EventsComponent,
      },
      { path: 'test', component: DisciplinesComponent }, // Test route for DisciplinesComponent
    ]
  },
  {
    path: '**', redirectTo: 'corp' 
  }
  
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UitsRoutingModule {}
