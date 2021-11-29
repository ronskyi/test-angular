import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, Observable, switchMap, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SpecieService } from '../../@api/services/specie.service';
import { Specie } from '../../@models/specie';

export enum SpecieCreateStateEnum {
  INITIAL,
  WAITING_RESPONSE,
  SUCCESS,
  UNKNOWN_ERROR,
}

export interface SpecieCreateState {
  createdId?: string;
  state: SpecieCreateStateEnum;
}

export const initialState = {
  state: SpecieCreateStateEnum.INITIAL,
} as SpecieCreateState;

@Injectable()
export class CreateSpecieStore extends ComponentStore<SpecieCreateState> {
  constructor(private readonly specieService: SpecieService) {
    super(initialState);
  }

  get isLoading$() {
    return this.select(
      (s) => s.state === SpecieCreateStateEnum.WAITING_RESPONSE,
    );
  }

  get createdId$() {
    return this.select((s) => s.createdId);
  }

  readonly create = this.effect((data$: Observable<Specie>) =>
    data$.pipe(
      tap(() => this.changeState(SpecieCreateStateEnum.WAITING_RESPONSE)),
      switchMap((data) =>
        this.specieService.create(data).pipe(
          catchError((err) => {
            this.changeState(SpecieCreateStateEnum.UNKNOWN_ERROR);
            return EMPTY;
          }),
        ),
      ),
      tap({
        next: (c) => {
          this.changeState(SpecieCreateStateEnum.SUCCESS);
          this.setCreatedId(c.id);
        },
        error: (e) => {
          this.changeState(SpecieCreateStateEnum.UNKNOWN_ERROR);
        },
      }),
      catchError(() => EMPTY),
    ),
  );

  private readonly changeState = this.updater(
    (state, result: SpecieCreateStateEnum) => {
      return { ...state, state: result };
    },
  );

  private readonly setCreatedId = this.updater((state, id: string) => {
    return { ...state, createdId: id };
  });
}
