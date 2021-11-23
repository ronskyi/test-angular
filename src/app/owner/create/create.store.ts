import { Owner } from '../../@models/owner';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, Observable, switchMap, tap } from 'rxjs';
import { OwnerService } from '../../@api/services/owner.service';
import { catchError } from 'rxjs/operators';

export enum OwnerCreateStateEnum {
  INITIAL,
  WAITING_RESPONSE,
  SUCCESS,
  UNKNOWN_ERROR,
}

export interface OwnerCreateState {
  createdId?: string;
  state: OwnerCreateStateEnum;
}

export const initialState = {
  state: OwnerCreateStateEnum.INITIAL
} as OwnerCreateState;

@Injectable()
export class CreateOwnerStore extends ComponentStore<OwnerCreateState> {

  constructor(
    private readonly ownerService: OwnerService
  ) {
    super(initialState);
  }

  get isLoading$() {
    return this.select(s => s.state === OwnerCreateStateEnum.WAITING_RESPONSE)
  }

  get createdId$() {
    return this.select(s => s.createdId)
  }

  readonly create = this.effect(
    (data$: Observable<Owner>) =>
      data$.pipe(
        tap(() => this.changeState(OwnerCreateStateEnum.WAITING_RESPONSE)),
        switchMap((data) => this.ownerService.create(data).pipe(
          catchError(err => {
            this.changeState(OwnerCreateStateEnum.UNKNOWN_ERROR)
            return EMPTY;
          })
        )),
        tap({
          next: (c) => {
            this.changeState(OwnerCreateStateEnum.SUCCESS)
            this.setCreatedId(c.id)
          },
          error: (e) => {
            this.changeState(OwnerCreateStateEnum.UNKNOWN_ERROR)
          }
        }),
        catchError(() => EMPTY)
      ),
  );

  private readonly changeState = this.updater(
    (state, result: OwnerCreateStateEnum) => {
      return {...state, state: result};
    },
  );

  private readonly setCreatedId = this.updater(
    (state, id: string) => {
      return {...state, createdId: id};
    },
  );
}
