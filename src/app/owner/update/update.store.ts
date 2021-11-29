import { Owner } from '../../@models/owner';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, Observable, switchMap, tap, withLatestFrom } from 'rxjs';
import { OwnerService } from '../../@api/services/owner.service';
import { catchError } from 'rxjs/operators';

export enum OwnerUpdateStateEnum {
  INITIAL,
  LOADING,
  LOADED,
  WAITING_RESPONSE,
  SUCCESS,
  UNKNOWN_ERROR,
}

export interface OwnerCreateState {
  owner?: Owner;
  state: OwnerUpdateStateEnum;
}

export const initialState = {
  state: OwnerUpdateStateEnum.INITIAL,
} as OwnerCreateState;

@Injectable()
export class UpdateOwnerStore extends ComponentStore<OwnerCreateState> {
  constructor(private readonly ownerService: OwnerService) {
    super(initialState);
  }

  get isLoading$() {
    return this.select(
      (s) =>
        s.state === OwnerUpdateStateEnum.LOADING ||
        s.state === OwnerUpdateStateEnum.WAITING_RESPONSE,
    );
  }

  get owner$() {
    return this.select((s) => s.owner);
  }

  readonly fetchOwner = this.effect((data$: Observable<string>) =>
    data$.pipe(
      tap(() => this.changeState(OwnerUpdateStateEnum.LOADING)),
      switchMap((data) =>
        this.ownerService.fetchById(data).pipe(
          catchError((err) => {
            this.changeState(OwnerUpdateStateEnum.UNKNOWN_ERROR);
            return EMPTY;
          }),
        ),
      ),
      tap({
        next: (c) => {
          this.changeState(OwnerUpdateStateEnum.LOADED);
          this.setOwner(c);
        },
        error: (e) => {
          this.changeState(OwnerUpdateStateEnum.UNKNOWN_ERROR);
        },
      }),
      catchError(() => EMPTY),
    ),
  );

  readonly update = this.effect((data$: Observable<Owner>) =>
    data$.pipe(
      tap(() => this.changeState(OwnerUpdateStateEnum.WAITING_RESPONSE)),
      withLatestFrom(this.owner$),
      switchMap(([data, owner]) =>
        this.ownerService.update({ ...data, id: owner!.id }).pipe(
          catchError((err) => {
            this.changeState(OwnerUpdateStateEnum.UNKNOWN_ERROR);
            return EMPTY;
          }),
        ),
      ),
      tap({
        next: (c) => {
          this.changeState(OwnerUpdateStateEnum.SUCCESS);
          this.setOwner(c);
        },
        error: (e) => {
          this.changeState(OwnerUpdateStateEnum.UNKNOWN_ERROR);
        },
      }),
      catchError(() => EMPTY),
    ),
  );

  private readonly changeState = this.updater(
    (state, result: OwnerUpdateStateEnum) => {
      return { ...state, state: result };
    },
  );

  private readonly setOwner = this.updater((state, owner: Owner) => {
    return { ...state, owner: owner };
  });
}
