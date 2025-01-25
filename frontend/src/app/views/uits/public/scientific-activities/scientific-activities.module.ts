import {AchievementListComponent} from './achievements/achievement-list/achievement-list.component';
import {CommonModule} from '@angular/common';
import {
  ConferencesComponent
} from '@app/views/uits/public/scientific-activities/deprecated/conferences/conferences.component';
import {LayoutModule} from '@app/layout/layout.module';
import {MarkdownModule} from 'ngx-markdown';
import {NgModule} from '@angular/core';
import {PostgraduateDissertationsComponent}
  from '@app/views/uits/public/scientific-activities/postgraduate/old/postgraduate-dissertations/postgraduate-dissertations.component';
import {PostgraduateInfoComponent}
  from './postgraduate/postgraduate-info/postgraduate-info.component';
import {PostgraduatePracticesComponent}
  from '@app/views/uits/public/scientific-activities/postgraduate/old/postgraduate-practices/postgraduate-practices.component';
import {PostgraduateSpecialtiesComponent}
  from '@app/views/uits/public/scientific-activities/postgraduate/old/postgraduate-specialties/postgraduate-specialties.component';
import {
  PublicationsComponent
} from '@app/views/uits/public/scientific-activities/deprecated/publications/publications.component';
import {ScientificActivitiesRoutingModule} from './scientific-activities-routing.module';
import {
  ScientificWorkComponent
} from '@app/views/uits/public/scientific-activities/deprecated/scientific-work/scientific-work.component';
import {AchievementDetailComponent} from './achievements/achievement-detail/achievement-detail.component';
import {MainSciencePageComponent}
  from '../scientific-publications/pages/main-science-page/main-science-page.component';
import {RegisterSciencePublicationComponent}
  from '../scientific-publications/pages/register-science-publication/register-science-publication.component';
import {EditAuthorPublicationPageComponent}
  from '../scientific-publications/pages/edit-author-publication-page/edit-author-publication-page.component';
import {QuillViewComponent} from 'ngx-quill';
import {EditButtonComponent} from '@app/shared/components/edit-button/edit-button.component';
import {CreateButtonComponent} from '@app/shared/components/create-button/create-button.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {ConferenceAnnouncementsComponent} from './conference-announcements/conference-announcements.component';
import { ConferenceAnnouncementDetailComponent } from './conference-announcements/conference-announcement-detail/conference-announcement-detail.component';
import {SharedModule} from '@app/shared/shared.module';
import { ResearchComponent } from './research/research.component';
import { ForumComponent } from './forum/forum.component';
import {PaginationModule} from 'ngx-bootstrap/pagination';

@NgModule({
  declarations: [
    PostgraduatePracticesComponent,
    PostgraduateSpecialtiesComponent,
    PostgraduateDissertationsComponent,
    PublicationsComponent,
    ScientificWorkComponent,
    ConferencesComponent,
    PostgraduateInfoComponent,
    AchievementListComponent,
    AchievementDetailComponent,
    ConferenceAnnouncementsComponent,
    ConferenceAnnouncementDetailComponent,
    ResearchComponent,
    ForumComponent

  ],
    imports: [
        CommonModule,
        ScientificActivitiesRoutingModule,
        LayoutModule,
        MarkdownModule.forRoot(),
        QuillViewComponent,
        EditButtonComponent,
        CreateButtonComponent,
        NgxDatatableModule,
        SharedModule,
        PaginationModule
    ]
})
export class ScientificActivitiesModule {
}
