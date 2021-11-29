import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IAuthState } from './auth.reducer';

export const selectAuth = createFeatureSelector<IAuthState>('auth');

export const selectToken = createSelector(selectAuth, (state) => state.token);

export const isLogined = createSelector(selectAuth, (state) => !!state.token);
