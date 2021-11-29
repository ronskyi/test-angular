import { createAction, props } from '@ngrx/store';
import { JWT } from '@models/jwt';

export const setToken = createAction(
  '[Auth] Login',
  props<{ token: string; tokenData: JWT }>(),
);
export const removeToken = createAction('[Auth] Logout');
