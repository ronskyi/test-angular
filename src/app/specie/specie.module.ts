import { NgModule } from '@angular/core';
import { ListComponent } from './list/list.component';
import { ApiModule } from '../@api/api.module';
import { SharedModule } from '../@shared/shared.module';
import { SpecieRoutingModule } from './specie-routing.module';
import { SpecieFormComponent } from './form/specie-form.component';
import { UpdateComponent } from './update/update.component';
import { CreateComponent } from './create/create.component';
import { DeleteComponent } from './delete/delete.component';

@NgModule({
  declarations: [
    SpecieFormComponent,
    ListComponent,
    UpdateComponent,
    CreateComponent,
    DeleteComponent
  ],
  imports: [
    SpecieRoutingModule,
    SharedModule,
    ApiModule
  ]
})
export class SpecieModule { }
