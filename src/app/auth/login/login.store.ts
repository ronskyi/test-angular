import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, Observable } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as AuthActions from '../@store/auth.actions';
import { AuthService } from '@api/services/auth.service';
import { UnauthorizedError } from '@api/errors/unauthorized.error';

export enum LoginStateEnum {
  INITIAL = 1,
  WAITING_RESPONSE,
  SUCCESS,
  LOGIN_ERROR,
  UNKNOWN_ERROR,
}

export interface ILoginFromState {
  loginState: LoginStateEnum;
}

@Injectable()
export class LoginStore extends ComponentStore<ILoginFromState> {
  constructor(
    private readonly store: Store,
    private readonly authService: AuthService,
  ) {
    super({ loginState: LoginStateEnum.INITIAL });
  }

  readonly loginState$: Observable<LoginStateEnum> =
    this.select<LoginStateEnum>((state) => state.loginState);

  readonly isLoginError$: Observable<boolean> = this.select<boolean>(
    (state) => state.loginState === LoginStateEnum.LOGIN_ERROR,
  );

  private readonly changeState = this.updater(
    (state, result: LoginStateEnum) => {
      return { ...state, loginState: result };
    },
  );

  readonly reset = this.updater(() => {
    return { loginState: LoginStateEnum.INITIAL };
  });

  readonly login = this.effect(
    (data$: Observable<{ email: string; password: string }>) =>
      data$.pipe(
        tap(() => this.changeState(LoginStateEnum.WAITING_RESPONSE)),
        switchMap((data) =>
          this.authService.getJwt(data.email, data.password).pipe(
            tap({
              next: ({ token, tokenData }) => {
                this.changeState(LoginStateEnum.SUCCESS);
                this.store.dispatch(
                  AuthActions.setToken({
                    token: token,
                    tokenData: tokenData,
                  }),
                );
              },
              error: (err) =>
                err instanceof UnauthorizedError
                  ? this.changeState(LoginStateEnum.LOGIN_ERROR)
                  : this.changeState(LoginStateEnum.UNKNOWN_ERROR),
            }),
            catchError(() => EMPTY),
          ),
        ),
      ),
  );
}
