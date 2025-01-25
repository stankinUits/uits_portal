import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientJsonpModule, HttpClientModule} from '@angular/common/http';
import {TranslateModule} from '@ngx-translate/core';
import {CSRFInterceptor} from '@app/shared/interceptor/csrf.interceptor';
import {ResizableComponent} from '@app/shared/components/base/resizable.component';
import { TimeFromDatePipe } from './pipes/time-from-date.pipe';
import { TimeWithoutSsPipe } from './pipes/time-without-ss.pipe';

@NgModule({
  declarations: [
    ResizableComponent,
    TimeFromDatePipe,
    TimeWithoutSsPipe,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    TranslateModule,
    TimeFromDatePipe,
    TimeWithoutSsPipe,
  ],
    imports: [
    ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: CSRFInterceptor, multi: true}
  ]
})

export class SharedModule {
}
