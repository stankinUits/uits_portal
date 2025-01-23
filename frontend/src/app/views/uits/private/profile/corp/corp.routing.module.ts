import {EventsComponent} from '../events/events.component';
import {PersonalComponent} from '../personal/personal.component';
import {CorporateComponent} from './corp.component';
import {AuthGuard} from '@app/shared/guards/auth.guard';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: CorporateComponent,
    data: {hidePageHeader: true},
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'personal',
        pathMatch: 'full'},
      {
        path: 'personal',
        component: PersonalComponent,
        data: {hidePageHeader: true},
      },
      {
        path: 'calendar',
        component: EventsComponent,
        data: {hidePageHeader: true},
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CorpRoutModule {
}
