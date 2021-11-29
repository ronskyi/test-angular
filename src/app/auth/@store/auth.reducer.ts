import { ActionReducer, createReducer, MetaReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { localStorageSync } from 'ngrx-store-localstorage';
import { JWT } from '@models/jwt';

export const authFeatureKey = 'auth';

export interface IAuthState {
  token?: string;
  tokenData?: JWT;
}

export const initialAuthState: IAuthState = {
  token: undefined,
  tokenData: undefined,
};

export const authReducer = createReducer(
  initialAuthState,
  on(
    AuthActions.setToken,
    (state: IAuthState, { token, tokenData }): IAuthState =>
      ({
        ...state,
        token,
        tokenData,
      } as IAuthState),
  ),
  on(
    AuthActions.removeToken,
    (state: IAuthState): IAuthState =>
      ({
        ...state,
        token: undefined,
        tokenData: undefined,
      } as IAuthState),
  ),
);

function localStorageSyncReducer(
  reducer: ActionReducer<IAuthState>,
): ActionReducer<IAuthState> {
  return localStorageSync({
    keys: ['token', 'tokenData'],
    rehydrate: true,
    removeOnUndefined: true,
  })(reducer) as ActionReducer<IAuthState>;
}

export const authMetaReducers: Array<MetaReducer> = [localStorageSyncReducer];
