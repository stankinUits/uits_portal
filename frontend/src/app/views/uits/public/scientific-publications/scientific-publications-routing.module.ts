import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  MainSciencePageComponent
} from '@app/views/uits/public/scientific-publications/pages/main-science-page/main-science-page.component';
import {
  RegisterSciencePublicationComponent
} from '@app/views/uits/public/scientific-publications/pages/register-science-publication/register-science-publication.component';
import {
  EditAuthorPublicationPageComponent
} from '@app/views/uits/public/scientific-publications/pages/edit-author-publication-page/edit-author-publication-page.component';


const routes: Routes = [
  { path: 'page/scientific-activity-publications', component: MainSciencePageComponent},
  { path: 'page/scientific-activity-publications/create_new_author', component: RegisterSciencePublicationComponent},
  { path: 'page/scientific-activity-publications/edit_author', component: EditAuthorPublicationPageComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScientificPublicationsRoutingModule { }
