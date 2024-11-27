import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UitsRoutingModule} from '@app/views/uits/uits-routing.module';
import {HomeComponent} from '@app/views/uits/public/home/home.component';
import {AboutModule} from '@app/views/uits/public/about/about.module';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { LatestNewsComponent } from './public/home/components/latest-news/latest-news.component';
import {ModalModule} from 'ngx-bootstrap/modal';
import {QuillEditorComponent} from 'ngx-quill';
import {SharedModule} from '@app/shared/shared.module';
import { LatestAnnouncementsComponent } from './public/home/components/latest-announcements/latest-announcements.component';
import {LayoutModule} from '@app/layout/layout.module';
import { CustomPageComponent } from './public/custom-page/custom-page.component';
import { CorporateComponent } from './private/profile/corp/corp.component';
import { PersonalComponent } from './private/profile/personal/personal.component';
import { EventsComponent } from './private/profile/events/events.component';
import { CalendarModule } from 'angular-calendar';
<<<<<<< HEAD
import { ScientificActivitiesModule } from './public/scientific-activities/scientific-activities.module';
=======

import {
  ScientificPublicationsModule
} from '@app/views/uits/public/scientific-publications/scientific-publications.module';

>>>>>>> b85ed7f2723c64469e93ecb0ab3625898c4f1f33

@NgModule({
  declarations: [
    CorporateComponent,
    HomeComponent,
    LatestNewsComponent,
    LatestAnnouncementsComponent,
    CustomPageComponent,
    PersonalComponent,
    EventsComponent,

  ],
  imports: [
    CommonModule,
    UitsRoutingModule,
    AboutModule,
    NgBootstrapFormValidationModule.forRoot(),
    ModalModule,
    QuillEditorComponent,
    SharedModule,
    LayoutModule,
<<<<<<< HEAD
    CalendarModule,
    ScientificActivitiesModule
=======
    CalendarModule
>>>>>>> b85ed7f2723c64469e93ecb0ab3625898c4f1f33
  ],
  exports: [

  ]
})
export class UitsModule {
}