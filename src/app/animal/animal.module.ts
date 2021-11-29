import { NgModule } from '@angular/core';
import { ListComponent } from './list/list.component';
import { ApiModule } from '@api/api.module';
import { SharedModule } from '@shared/shared.module';
import { AnimalRoutingModule } from './animal-routing.module';
import { AnimalFormComponent } from './form/animal-form.component';
import { UpdateComponent } from './update/update.component';
import { CreateComponent } from './create/create.component';
import { DeleteComponent } from './delete/delete.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [
    AnimalFormComponent,
    ListComponent,
    UpdateComponent,
    CreateComponent,
    DeleteComponent,
  ],
  imports: [
    AnimalRoutingModule,
    SharedModule,
    ApiModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatSelectSearchModule,
    MatDividerModule,
  ],
})
export class AnimalModule {}
