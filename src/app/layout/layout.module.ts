import { NgModule } from '@angular/core';
import { SharedModule } from '../@shared/shared.module';
import { RouterModule } from '@angular/router';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LayoutComponent } from './layout/layout.component';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  declarations: [SideMenuComponent, LayoutComponent],
  imports: [
    SharedModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
  ],
  exports: [LayoutComponent],
})
export class LayoutModule {}
