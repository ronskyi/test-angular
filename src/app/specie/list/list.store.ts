import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, Observable, switchMap, tap } from 'rxjs';
import { Collection } from '../../@models/collection';
import { catchError } from 'rxjs/operators';
import { Specie } from '../../@models/specie';
import { SpecieService } from '../../@api/services/specie.service';

export enum SpecieListLoadingStateEnum {
  INITIAL,
  LOADING,
  SUCCESS,
  UNKNOWN_ERROR,
}

export interface SpecieListState {
  list: Specie[];
  total: number;
  page: number;
  pageSize: number;
  state: SpecieListLoadingStateEnum
}

export const initialState = {
  list: [],
  total: 0,
  page: 1,
  pageSize: 10,
  state: SpecieListLoadingStateEnum.INITIAL
} as SpecieListState;

@Injectable()
export class SpecieListStore extends ComponentStore<SpecieListState> {

  constructor(
    private readonly specieService: SpecieService
  ) {
    super(initialState);
  }

  get items$() {
    return this.select(s => s.list)
  }

  get total$() {
    return this.select(s => s.total)
  }

  get isLoading$() {
    return this.select(s => s.state === SpecieListLoadingStateEnum.LOADING)
  }

  readonly fetchList = this.effect(
    (data$: Observable<{ page: number; pageSize: number }>) =>
      data$.pipe(
        tap(() => this.changeState(SpecieListLoadingStateEnum.LOADING)),
        tap((data) => this.setPagination({page: data.page, pageSize: data.pageSize})),
        switchMap((data) => this.specieService.fetchList('', data.page, data.pageSize)),
        tap({
          next: (c) => {
            this.setList(c);
            this.changeState(SpecieListLoadingStateEnum.SUCCESS)
          },
          error: () => {
            this.changeState(SpecieListLoadingStateEnum.UNKNOWN_ERROR)
          }
        }),
        catchError(() => EMPTY)
      ),
  );

  private readonly changeState = this.updater(
    (state, result: SpecieListLoadingStateEnum) => {
      return {...state, state: result};
    },
  );

  private readonly setList = this.updater(
    (state, list: Collection<Specie>) => {
      return {...state, list: list.items, total: list.total};
    },
  );

  private readonly setPagination = this.updater(
    (state, pagination: { page: number, pageSize: number}) => {
      return {...state, page: pagination.page, pageSize: pagination.pageSize};
    },
  );
}
