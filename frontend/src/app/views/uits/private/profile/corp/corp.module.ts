import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { CorporateComponent } from './corp.component';
import { AuthGuard } from '@app/shared/guards/auth.guard';
import { CommonModule } from '@angular/common';
import {routes} from './corp.routing.module';
import { PersonalComponent } from '../personal/personal.component';
import { EventsComponent } from '../events/events.component';
import { CorpRoutModule } from './corp.routing.module';

@NgModule({
  declarations: [
    CorporateComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    PersonalComponent,
    EventsComponent,
    CorpRoutModule

  ],
  exports: [],
  providers: [
    AuthGuard
    
  ]
})
export class CorporateModule {}
