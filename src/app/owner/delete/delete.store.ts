import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, Observable, switchMap, tap } from 'rxjs';
import { OwnerService } from '../../@api/services/owner.service';
import { catchError } from 'rxjs/operators';

export enum OwnerDeleteStateEnum {
  INITIAL,
  WAITING_RESPONSE,
  SUCCESS,
  UNKNOWN_ERROR,
}

export interface OwnerDeleteState {
  state: OwnerDeleteStateEnum;
}

export const initialState = {
  state: OwnerDeleteStateEnum.INITIAL,
} as OwnerDeleteState;

@Injectable()
export class OwnerDeleteStore extends ComponentStore<OwnerDeleteState> {
  constructor(private readonly ownerService: OwnerService) {
    super(initialState);
  }

  get isLoading$() {
    return this.select(
      (s) => s.state === OwnerDeleteStateEnum.WAITING_RESPONSE,
    );
  }

  get isDeleted$() {
    return this.select((s) => s.state === OwnerDeleteStateEnum.SUCCESS);
  }

  readonly deleteOwner = this.effect((data$: Observable<string>) =>
    data$.pipe(
      tap(() => this.changeState(OwnerDeleteStateEnum.WAITING_RESPONSE)),
      switchMap((id) => this.ownerService.delete(id)),
      tap({
        next: (c) => {
          c
            ? this.changeState(OwnerDeleteStateEnum.SUCCESS)
            : this.changeState(OwnerDeleteStateEnum.UNKNOWN_ERROR);
        },
        error: (e) => {
          console.log(e);
          this.changeState(OwnerDeleteStateEnum.UNKNOWN_ERROR);
        },
      }),
      catchError(() => EMPTY),
    ),
  );

  private readonly changeState = this.updater(
    (state, result: OwnerDeleteStateEnum) => {
      return { ...state, state: result };
    },
  );
}
