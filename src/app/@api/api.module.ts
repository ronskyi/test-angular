import { NgModule } from '@angular/core';
import { OwnerService } from './services/owner.service';
import { httpInterceptorProviders } from './http-interceptors';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [],
  providers: [
    ...httpInterceptorProviders,
    OwnerService
  ],
  imports: [
    HttpClientModule
  ],
})
export class ApiModule { }
