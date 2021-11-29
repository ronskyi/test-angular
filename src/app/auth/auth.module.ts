import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '@shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { authFeatureKey, authMetaReducers, authReducer } from './@store/auth.reducer';
import { ApiModule } from '@api/api.module';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    StoreModule.forFeature(authFeatureKey, authReducer, { metaReducers: authMetaReducers }),
    ApiModule,
    SharedModule
  ]
})
export class AuthModule { }
