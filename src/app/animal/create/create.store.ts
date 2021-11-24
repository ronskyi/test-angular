import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, Observable, switchMap, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { createInitialCreateState, CreateState } from '@shared/component-store/crud/states';
import { CreateStateEnum } from '@shared/component-store/crud/enums';
import { AnimalService } from '@api/services/animal.service';
import { Animal } from '@models/animal';

@Injectable()
export class CreateSpecieStore extends ComponentStore<CreateState> {

  constructor(
    private readonly animalService: AnimalService
  ) {
    super(createInitialCreateState());
  }

  get isLoading$() {
    return this.select(s => s.state === CreateStateEnum.WAITING_RESPONSE)
  }

  get createdId$() {
    return this.select(s => s.createdId)
  }

  readonly create = this.effect(
    (data$: Observable<Animal>) =>
      data$.pipe(
        tap(() => this.changeState(CreateStateEnum.WAITING_RESPONSE)),
        switchMap((data) => this.animalService.create(data).pipe(
          catchError(err => {
            this.changeState(CreateStateEnum.UNKNOWN_ERROR)
            return EMPTY;
          })
        )),
        tap({
          next: (c) => {
            this.changeState(CreateStateEnum.SUCCESS)
            this.setCreatedId(c.id as string)
          },
          error: (e) => {
            this.changeState(CreateStateEnum.UNKNOWN_ERROR)
          }
        }),
        catchError(() => EMPTY)
      ),
  );

  private readonly changeState = this.updater(
    (state, result: CreateStateEnum) => {
      return {...state, state: result};
    },
  );

  private readonly setCreatedId = this.updater(
    (state, id: string) => {
      return {...state, createdId: id};
    },
  );
}
