import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
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
  {
    path: 'animals',
    loadChildren: () =>
      import('./animal/animal.module').then((m) => m.AnimalModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
