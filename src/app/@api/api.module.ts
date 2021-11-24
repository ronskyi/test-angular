import { NgModule } from '@angular/core';
import { OwnerService } from './services/owner.service';
import { httpInterceptorProviders } from './http-interceptors';
import { HttpClientModule } from '@angular/common/http';
import { SpecieService } from './services/specie.service';

@NgModule({
  declarations: [],
  providers: [
    ...httpInterceptorProviders,
    OwnerService,
    SpecieService,
  ],
  imports: [
    HttpClientModule
  ],
})
export class ApiModule { }
