import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ScientificPublicationsRoutingModule} from './scientific-publications-routing.module';
import {LayoutModule} from '@app/layout/layout.module';
import {
  EditAuthorPublicationPageComponent
} from '@app/views/uits/public/scientific-publications/pages/edit-author-publication-page/edit-author-publication-page.component';
import {
  MainSciencePageComponent
} from '@app/views/uits/public/scientific-publications/pages/main-science-page/main-science-page.component';
import {
  RegisterSciencePublicationComponent
} from '@app/views/uits/public/scientific-publications/pages/register-science-publication/register-science-publication.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ScientificPublicationsRoutingModule,
    LayoutModule,
    EditAuthorPublicationPageComponent,
    MainSciencePageComponent,
    RegisterSciencePublicationComponent
  ]
})
export class ScientificPublicationsModule {
}
