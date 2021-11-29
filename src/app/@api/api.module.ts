import { NgModule } from '@angular/core';
import { OwnerService } from './services/owner.service';
import { httpInterceptorProviders } from './http-interceptors';
import { HttpClientModule } from '@angular/common/http';
import { SpecieService } from './services/specie.service';
import { AnimalService } from './services/animal.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '@api/services/auth.service';

@NgModule({
  declarations: [],
  providers: [
    ...httpInterceptorProviders,
    OwnerService,
    SpecieService,
    AnimalService,
    AuthService,
    {
      provide: JwtHelperService,
      useFactory: () => new JwtHelperService(),
    },
  ],
  imports: [HttpClientModule],
})
export class ApiModule {}
