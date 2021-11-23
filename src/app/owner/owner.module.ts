import { NgModule } from '@angular/core';
import { ListComponent } from './list/list.component';
import { ApiModule } from '../@api/api.module';
import { SharedModule } from '../@shared/shared.module';
import { OwnerRoutingModule } from './owner-routing.module';
import { OwnerFormComponent } from './form/owner-form.component';
import { UpdateComponent } from './update/update.component';
import { CreateComponent } from './create/create.component';
import { DeleteComponent } from './delete/delete.component';

@NgModule({
  declarations: [
    OwnerFormComponent,
    ListComponent,
    UpdateComponent,
    CreateComponent,
    DeleteComponent
  ],
  imports: [
    OwnerRoutingModule,
    SharedModule,
    ApiModule
  ]
})
export class OwnerModule { }
