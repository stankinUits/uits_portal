import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { AppLayoutComponent } from './layout/app-layout/app-layout-component';
import { HomeComponent } from './views/uits/public/home/home.component';
import { AUTH_LAYOUT_ROUTES } from './routes/auth-layout.routes';
import { APP_LAYOUT_ROUTES } from './routes/app-layout.routes';


const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      ...APP_LAYOUT_ROUTES,
      {
        path: 'home',
        component: HomeComponent
      }
    ]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: AUTH_LAYOUT_ROUTES
  },
  {
    path: 'corp',
    loadChildren: () => import('./views/uits/uits.module').then(m => m.UitsModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      preloadingStrategy: PreloadAllModules,
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
      relativeLinkResolution: 'legacy'
    })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
