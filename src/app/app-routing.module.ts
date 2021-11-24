import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'owners',
    loadChildren: () =>
      import('./owner/owner.module').then((m) => m.OwnerModule),
  },
  {
    path: 'species',
    loadChildren: () =>
      import('./specie/specie.module').then((m) => m.SpecieModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
