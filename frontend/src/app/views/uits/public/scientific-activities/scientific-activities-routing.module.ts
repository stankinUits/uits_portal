import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AchievementDetailComponent} from './achievements/achievement-detail/achievement-detail.component';
import {AchievementListComponent} from './achievements/achievement-list/achievement-list.component';
import {MainSciencePageComponent} from '../scientific-publications/pages/main-science-page/main-science-page.component';
import {
  RegisterSciencePublicationComponent
} from '../scientific-publications/pages/register-science-publication/register-science-publication.component';
import {
  EditAuthorPublicationPageComponent
} from '../scientific-publications/pages/edit-author-publication-page/edit-author-publication-page.component';
import {
  ManageTagsPageComponent
} from '@app/views/uits/public/scientific-publications/pages/manage-tags-page/manage-tags-page.component';
import {
  PostgraduateInfoComponent
} from '@app/views/uits/public/scientific-activities/postgraduate/postgraduate-info/postgraduate-info.component';
import {
  ConferenceAnnouncementsComponent
} from '@app/views/uits/public/scientific-activities/conference-announcements/conference-announcements.component';
import {
  ConferenceAnnouncementDetailComponent
} from '@app/views/uits/public/scientific-activities/conference-announcements/conference-announcement-detail/conference-announcement-detail.component';

const routes: Routes = [
  {path: 'achievements', component: AchievementListComponent},
  {path: 'achievements/:id', component: AchievementDetailComponent},
  {path: 'postgraduate', component: PostgraduateInfoComponent},
  {path: 'conferences', component: ConferenceAnnouncementsComponent},
  {path: 'conferences/:id', component: ConferenceAnnouncementDetailComponent},
  {path: 'publications/main-science-page', component: MainSciencePageComponent},
  {path: 'publications/create_new_author', component: RegisterSciencePublicationComponent},
  {path: 'publications/edit_author', component: EditAuthorPublicationPageComponent},
  {path: 'publications/manage_tags', component: ManageTagsPageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScientificActivitiesRoutingModule {
}
