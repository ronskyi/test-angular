import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, Observable, switchMap, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SpecieService } from '../../@api/services/specie.service';

export enum SpecieDeleteStateEnum {
  INITIAL,
  WAITING_RESPONSE,
  SUCCESS,
  UNKNOWN_ERROR,
}

export interface SpecieDeleteState {
  state: SpecieDeleteStateEnum
}

export const initialState = {
  state: SpecieDeleteStateEnum.INITIAL
} as SpecieDeleteState;

@Injectable()
export class SpecieDeleteStore extends ComponentStore<SpecieDeleteState> {

  constructor(
    private readonly specieService: SpecieService
  ) {
    super(initialState);
  }

  get isLoading$() {
    return this.select(s => s.state === SpecieDeleteStateEnum.WAITING_RESPONSE)
  }

  get isDeleted$() {
    return this.select(s => s.state === SpecieDeleteStateEnum.SUCCESS)
  }

  readonly deleteOwner = this.effect(
    (data$: Observable<string>) =>
      data$.pipe(
        tap(() => this.changeState(SpecieDeleteStateEnum.WAITING_RESPONSE)),
        switchMap((id) => this.specieService.delete(id)),
        tap({
          next: (c) => {
            c ? this.changeState(SpecieDeleteStateEnum.SUCCESS) : this.changeState(SpecieDeleteStateEnum.UNKNOWN_ERROR);
          },
          error: (e) => {
            this.changeState(SpecieDeleteStateEnum.UNKNOWN_ERROR)
          }
        }),
        catchError(() => EMPTY)
      ),
  );

  private readonly changeState = this.updater(
    (state, result: SpecieDeleteStateEnum) => {
      return {...state, state: result};
    },
  );
}
