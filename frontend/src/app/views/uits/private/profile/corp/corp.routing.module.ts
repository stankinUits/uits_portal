import { EventsComponent } from '../events/events.component';
import { PersonalComponent } from '../personal/personal.component';
import { CorporateComponent } from './corp.component';
import { AuthGuard } from '@app/shared/guards/auth.guard';

export const routes = [
  {
    path: 'corp',
    component: CorporateComponent,
    data: { hidePageHeader: true },
    canActivate: [AuthGuard]
  },
  {
    path: 'personal',
    component: PersonalComponent, // Или другой компонент, если необходимо
    data: { hidePageHeader: true },
  },

  {
    path:"calendar",
    component: EventsComponent,
    data: { hidePageHeader: true},
  },



];

export class CorpRoutModule{};
