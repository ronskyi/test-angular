import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, Observable, switchMap, tap, withLatestFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AnimalService } from '@api/services/animal.service';
import { createInitialUpdateState, UpdateState } from '@shared/component-store/crud/states';
import { Animal } from '@models/animal';
import { UpdateStateEnum } from '@shared/component-store/crud/enums';

@Injectable()
export class UpdateAnimalStore extends ComponentStore<UpdateState<Animal>> {

  constructor(
    private readonly animalService: AnimalService
  ) {
    super(createInitialUpdateState<Animal>());
  }

  get isLoading$() {
    return this.select(s =>
      s.state === UpdateStateEnum.LOADING ||
      s.state === UpdateStateEnum.WAITING_RESPONSE
    )
  }

  get item$() {
    return this.select(s => s.item)
  }

  readonly fetchItem = this.effect(
    (data$: Observable<string>) =>
      data$.pipe(
        tap(() => this.changeState(UpdateStateEnum.LOADING)),
        switchMap((id) => this.animalService.fetchById(id).pipe(
          catchError(err => {
            console.log(err)
            this.changeState(UpdateStateEnum.UNKNOWN_ERROR)
            return EMPTY;
          })
        )),
        tap({
          next: (item) => {
            this.changeState(UpdateStateEnum.LOADED)
            this.setItem(item)
          },
          error: () => {
            this.changeState(UpdateStateEnum.UNKNOWN_ERROR)
          }
        }),
        catchError((err) => {
          console.log(err)
          return EMPTY;
        })
      ),
  );

  readonly update = this.effect(
    (data$: Observable<Animal>) =>
      data$.pipe(
        tap(() => this.changeState(UpdateStateEnum.WAITING_RESPONSE)),
        withLatestFrom(this.item$),
        switchMap(([data, item]) => this.animalService.update({...data, id: item!.id}).pipe(
          catchError(err => {
            console.log(err)
            this.changeState(UpdateStateEnum.UNKNOWN_ERROR)
            return EMPTY;
          })
        )),
        tap({
          next: (c) => {
            this.changeState(UpdateStateEnum.SUCCESS)
            this.setItem(c)
          },
          error: (e) => {
            this.changeState(UpdateStateEnum.UNKNOWN_ERROR)
          }
        }),
        catchError((err) => {
          console.log(err)
          return EMPTY;
        })
      ),
  );

  private readonly changeState = this.updater(
    (state, result: UpdateStateEnum) => {
      return {...state, state: result};
    },
  );

  private readonly setItem = this.updater(
    (state, item: Animal) => {
      return {...state, item: item};
    },
  );
}
