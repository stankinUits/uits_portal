import { AchievementListComponent } from './achievement-list/achievement-list.component';
import { CommonModule } from '@angular/common';
import { ConferencesComponent } from '@app/views/uits/public/scientific-activities/deprecated/conferences/conferences.component';
import {LayoutModule} from "@app/layout/layout.module";
import { MarkdownModule } from 'ngx-markdown';
import { NgModule } from '@angular/core';
import { PostgraduateDissertationsComponent } from '@app/views/uits/public/scientific-activities/postgraduate/old/postgraduate-dissertations/postgraduate-dissertations.component';
import { PostgraduateInfoComponent } from './postgraduate/postgraduate-info/postgraduate-info.component';
import { PostgraduatePracticesComponent } from '@app/views/uits/public/scientific-activities/postgraduate/old/postgraduate-practices/postgraduate-practices.component';
import { PostgraduateSpecialtiesComponent } from '@app/views/uits/public/scientific-activities/postgraduate/old/postgraduate-specialties/postgraduate-specialties.component';
import { PublicationsComponent } from '@app/views/uits/public/scientific-activities/deprecated/publications/publications.component';
import { ScientificActivitiesRoutingModule } from './scientific-activities-routing.module';
import { ScientificWorkComponent } from '@app/views/uits/public/scientific-activities/deprecated/scientific-work/scientific-work.component';
import { AchievementDetailComponent } from './achievement-detail/achievement-detail.component';

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
  ],
  imports: [
    CommonModule,
    ScientificActivitiesRoutingModule,
    LayoutModule,
    MarkdownModule.forRoot()
  ]
})
export class ScientificActivitiesModule { }
