import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, Observable, switchMap, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DeleteComponentStateEnum } from '@shared/component-store/crud/enums';
import {
  createInitialDeleteState,
  DeleteButtonState,
} from '@shared/component-store/crud/states';
import { AnimalService } from '@api/services/animal.service';

@Injectable()
export class DeleteAnimalStore extends ComponentStore<DeleteButtonState> {
  constructor(private readonly animalService: AnimalService) {
    super(createInitialDeleteState());
  }

  get isLoading$() {
    return this.select(
      (s) => s.state === DeleteComponentStateEnum.WAITING_RESPONSE,
    );
  }

  get isDeleted$() {
    return this.select((s) => s.state === DeleteComponentStateEnum.SUCCESS);
  }

  readonly deleteItem = this.effect((data$: Observable<string>) =>
    data$.pipe(
      tap(() => this.changeState(DeleteComponentStateEnum.WAITING_RESPONSE)),
      switchMap((id) => this.animalService.delete(id)),
      tap({
        next: (c) => {
          c
            ? this.changeState(DeleteComponentStateEnum.SUCCESS)
            : this.changeState(DeleteComponentStateEnum.UNKNOWN_ERROR);
        },
        error: (e) => {
          this.changeState(DeleteComponentStateEnum.UNKNOWN_ERROR);
        },
      }),
      catchError(() => EMPTY),
    ),
  );

  private readonly changeState = this.updater(
    (state, result: DeleteComponentStateEnum) => {
      return { ...state, state: result };
    },
  );
}
