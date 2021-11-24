import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, Observable, switchMap, tap, withLatestFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SpecieService } from '../../@api/services/specie.service';
import { Specie } from '../../@models/specie';

export enum SpecieUpdateStateEnum {
  INITIAL,
  LOADING,
  LOADED,
  WAITING_RESPONSE,
  SUCCESS,
  UNKNOWN_ERROR,
}

export interface SpecieCreateState {
  specie?: Specie;
  state: SpecieUpdateStateEnum;
}

export const initialState = {
  state: SpecieUpdateStateEnum.INITIAL
} as SpecieCreateState;

@Injectable()
export class UpdateSpecieStore extends ComponentStore<SpecieCreateState> {

  constructor(
    private readonly specieService: SpecieService
  ) {
    super(initialState);
  }

  get isLoading$() {
    return this.select(s =>
      s.state === SpecieUpdateStateEnum.LOADING ||
      s.state === SpecieUpdateStateEnum.WAITING_RESPONSE
    )
  }

  get item$() {
    return this.select(s => s.specie)
  }

  readonly fetchOwner = this.effect(
    (data$: Observable<string>) =>
      data$.pipe(
        tap(() => this.changeState(SpecieUpdateStateEnum.LOADING)),
        switchMap((data) => this.specieService.fetchById(data).pipe(
          catchError(err => {
            this.changeState(SpecieUpdateStateEnum.UNKNOWN_ERROR)
            return EMPTY;
          })
        )),
        tap({
          next: (c) => {
            this.changeState(SpecieUpdateStateEnum.LOADED)
            this.setSpecie(c)
          },
          error: (e) => {
            this.changeState(SpecieUpdateStateEnum.UNKNOWN_ERROR)
          }
        }),
        catchError(() => EMPTY)
      ),
  );

  readonly update = this.effect(
    (data$: Observable<Specie>) =>
      data$.pipe(
        tap(() => this.changeState(SpecieUpdateStateEnum.WAITING_RESPONSE)),
        withLatestFrom(this.item$),
        switchMap(([data, specie]) => this.specieService.update({...data, id: specie!.id}).pipe(
          catchError(err => {
            this.changeState(SpecieUpdateStateEnum.UNKNOWN_ERROR)
            return EMPTY;
          })
        )),
        tap({
          next: (c) => {
            this.changeState(SpecieUpdateStateEnum.SUCCESS)
            this.setSpecie(c)
          },
          error: (e) => {
            this.changeState(SpecieUpdateStateEnum.UNKNOWN_ERROR)
          }
        }),
        catchError(() => EMPTY)
      ),
  );

  private readonly changeState = this.updater(
    (state, result: SpecieUpdateStateEnum) => {
      return {...state, state: result};
    },
  );

  private readonly setSpecie = this.updater(
    (state, item: Specie) => {
      return {...state, specie: item};
    },
  );
}
