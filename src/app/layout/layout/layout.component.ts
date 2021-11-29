import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { isLogined } from '../../auth/@store/auth.selectors';
import * as AuthActions from '../../auth/@store/auth.actions';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {

  logined$: Observable<boolean>

  constructor(
    private readonly store: Store
  ) {
    this.logined$ = store.select(isLogined);
  }

  logout() {
    this.store.dispatch(AuthActions.removeToken());
  }
}
