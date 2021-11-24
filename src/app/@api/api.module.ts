import { NgModule } from '@angular/core';
import { OwnerService } from './services/owner.service';
import { httpInterceptorProviders } from './http-interceptors';
import { HttpClientModule } from '@angular/common/http';
import { SpecieService } from './services/specie.service';
import { AnimalService } from './services/animal.service';

@NgModule({
  declarations: [],
  providers: [
    ...httpInterceptorProviders,
    OwnerService,
    SpecieService,
    AnimalService,
  ],
  imports: [
    HttpClientModule
  ],
})
export class ApiModule { }
