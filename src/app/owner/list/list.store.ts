import { Owner } from '../../@models/owner';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, Observable, switchMap, tap, withLatestFrom } from 'rxjs';
import { OwnerService } from '../../@api/services/owner.service';
import { Collection } from '../../@models/collection';
import { catchError } from 'rxjs/operators';

export enum OwnerListLoadingStateEnum {
  INITIAL,
  LOADING,
  SUCCESS,
  UNKNOWN_ERROR,
}

export interface OwnerListState {
  list: Owner[];
  total: number;
  page: number;
  pageSize: number;
  state: OwnerListLoadingStateEnum;
}

export const initialState = {
  list: [],
  total: 0,
  page: 1,
  pageSize: 10,
  state: OwnerListLoadingStateEnum.INITIAL,
} as OwnerListState;

@Injectable()
export class OwnerListStore extends ComponentStore<OwnerListState> {
  constructor(private readonly ownerService: OwnerService) {
    super(initialState);
  }

  get items$() {
    return this.select((s) => s.list);
  }

  get total$() {
    return this.select((s) => s.total);
  }

  get isLoading$() {
    return this.select((s) => s.state === OwnerListLoadingStateEnum.LOADING);
  }

  readonly fetchList = this.effect(
    (data$: Observable<{ page: number; pageSize: number }>) =>
      data$.pipe(
        tap(() => this.changeState(OwnerListLoadingStateEnum.LOADING)),
        tap((data) =>
          this.setPagination({ page: data.page, pageSize: data.pageSize }),
        ),
        switchMap((data) =>
          this.ownerService.fetchList('', data.page, data.pageSize),
        ),
        tap({
          next: (c) => {
            this.setList(c);
            this.changeState(OwnerListLoadingStateEnum.SUCCESS);
          },
          error: () => {
            this.changeState(OwnerListLoadingStateEnum.UNKNOWN_ERROR);
          },
        }),
        catchError(() => EMPTY),
      ),
  );

  private readonly changeState = this.updater(
    (state, result: OwnerListLoadingStateEnum) => {
      return { ...state, state: result };
    },
  );

  private readonly setList = this.updater((state, list: Collection<Owner>) => {
    return { ...state, list: list.items, total: list.total };
  });

  private readonly setPagination = this.updater(
    (state, pagination: { page: number; pageSize: number }) => {
      return { ...state, page: pagination.page, pageSize: pagination.pageSize };
    },
  );
}
