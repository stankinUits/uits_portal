import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UitsRoutingModule} from '@app/views/uits/uits-routing.module';
import {HomeComponent} from '@app/views/uits/public/home/home.component';
import {AboutModule} from '@app/views/uits/public/about/about.module';
import {CorporateModule} from '@app/views/uits/private/profile/corp/corp.module';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { LatestNewsComponent } from './public/home/components/latest-news/latest-news.component';
import {ModalModule} from 'ngx-bootstrap/modal';
import {QuillEditorComponent} from 'ngx-quill';
import {SharedModule} from '@app/shared/shared.module';
import { LatestAnnouncementsComponent } from './public/home/components/latest-announcements/latest-announcements.component';
import {LayoutModule} from '@app/layout/layout.module';
import { CustomPageComponent } from './public/custom-page/custom-page.component';
import { CalendarModule } from 'angular-calendar';
import { ScientificActivitiesModule } from './public/scientific-activities/scientific-activities.module';
import {
  EditablePublicationCardComponent
} from '@app/views/uits/public/scientific-publications/common-ui/editable-publication-card/editable-publication-card.component';
import { SerpApiComponent } from '@app/views/uits/public/scientific-publications/pages/serp-api/serp-api.component';
import {NgSelectModule} from "@ng-select/ng-select";


@NgModule({
  declarations: [
    HomeComponent,
    LatestNewsComponent,
    LatestAnnouncementsComponent,
    CustomPageComponent,
    SerpApiComponent
  ],
  imports: [
    CommonModule,
    UitsRoutingModule,
    AboutModule,
    CorporateModule,
    NgBootstrapFormValidationModule.forRoot(),
    ModalModule,
    QuillEditorComponent,
    SharedModule,
    LayoutModule,
    CalendarModule,
    ScientificActivitiesModule,
    EditablePublicationCardComponent,
    NgSelectModule
  ],
  exports: [

  ]
})
export class UitsModule {
}
