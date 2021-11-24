import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, Observable, switchMap, tap } from 'rxjs';
import { Collection } from '@models/collection';
import { catchError } from 'rxjs/operators';
import { createInitialListState, ListState } from '@shared/component-store/crud/states';
import { Animal } from '@models/animal';
import { ListLoadingStateEnum } from '@shared/component-store/crud/enums';
import { AnimalService } from '@api/services/animal.service';

@Injectable()
export class SpecieListStore extends ComponentStore<ListState<Animal>> {

  constructor(
    private readonly animalService: AnimalService
  ) {
    super(createInitialListState<Animal>());
  }

  get items$() {
    return this.select(s => s.list)
  }

  get total$() {
    return this.select(s => s.total)
  }

  get isLoading$() {
    return this.select(s => s.state === ListLoadingStateEnum.LOADING)
  }

  readonly fetchList = this.effect(
    (data$: Observable<{ page: number; pageSize: number }>) =>
      data$.pipe(
        tap(() => this.changeState(ListLoadingStateEnum.LOADING)),
        tap((data) => this.setPagination({page: data.page, pageSize: data.pageSize})),
        switchMap((data) => this.animalService.fetchList(data.page, data.pageSize)),
        tap({
          next: (c) => {
            this.setList(c);
            this.changeState(ListLoadingStateEnum.SUCCESS)
          },
          error: () => {
            this.changeState(ListLoadingStateEnum.UNKNOWN_ERROR)
          }
        }),
        catchError(() => EMPTY)
      ),
  );

  private readonly changeState = this.updater(
    (state, result: ListLoadingStateEnum) => {
      return {...state, state: result};
    },
  );

  private readonly setList = this.updater(
    (state, list: Collection<Animal>) => {
      return {...state, list: list.items, total: list.total};
    },
  );

  private readonly setPagination = this.updater(
    (state, pagination: { page: number, pageSize: number}) => {
      return {...state, page: pagination.page, pageSize: pagination.pageSize};
    },
  );
}
