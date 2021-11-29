import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { debounceTime, EMPTY, filter, Observable, switchMap, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SpecieService } from '@api/services/specie.service';
import { ListLoadingStateEnum } from '@shared/component-store/crud/enums';
import { Specie } from '@models/specie';
import { Owner } from '@models/owner';
import { OwnerService } from '@api/services/owner.service';

export interface AnimalFormState {
  ownersState: ListLoadingStateEnum;
  speciesState: ListLoadingStateEnum;
  species: Specie[];
  owners: Owner[];
}

export const createInitialAnimalFormState = (): AnimalFormState => ({
  ownersState: ListLoadingStateEnum.INITIAL,
  speciesState: ListLoadingStateEnum.INITIAL,
  species: [],
  owners: [],
});

@Injectable()
export class AnimalFormStore extends ComponentStore<AnimalFormState> {
  constructor(
    private readonly specieService: SpecieService,
    private readonly ownerService: OwnerService,
  ) {
    super(createInitialAnimalFormState());
    this.fetchOwners('');
    this.fetchSpecies('');
  }

  get owners$() {
    return this.select((s) => s.owners);
  }

  get species$() {
    return this.select((s) => s.species);
  }

  get isSpeciesLoading$() {
    return this.select((s) => s.speciesState === ListLoadingStateEnum.LOADING);
  }

  get isOwnersLoading$() {
    return this.select((s) => s.ownersState === ListLoadingStateEnum.LOADING);
  }

  readonly updateSpeciesWithKeyword = this.effect((data$: Observable<string>) =>
    data$.pipe(
      debounceTime(500),
      filter((v) => v.length > 2),
      tap((keyword) => this.fetchSpecies(keyword)),
    ),
  );

  readonly updateOwnersWithKeyword = this.effect((data$: Observable<string>) =>
    data$.pipe(
      debounceTime(500),
      filter((v) => v.length > 2),
      tap((keyword) => this.fetchOwners(keyword)),
    ),
  );

  private readonly fetchOwners = this.effect((data$: Observable<string>) =>
    data$.pipe(
      tap(() => this.changeOwnerState(ListLoadingStateEnum.LOADING)),
      switchMap((keyword) => this.ownerService.fetchList(keyword, 1, 10)),
      tap({
        next: (c) => {
          this.changeOwnerState(ListLoadingStateEnum.SUCCESS);
          this.setOwners(c.items);
        },
        error: (e) => {
          this.changeOwnerState(ListLoadingStateEnum.UNKNOWN_ERROR);
        },
      }),
      catchError(() => EMPTY),
    ),
  );

  private readonly fetchSpecies = this.effect((data$: Observable<string>) =>
    data$.pipe(
      tap(() => this.changeSpeciesState(ListLoadingStateEnum.LOADING)),
      switchMap((keyword) => this.specieService.fetchList(keyword, 1, 10)),
      tap({
        next: (c) => {
          this.changeSpeciesState(ListLoadingStateEnum.SUCCESS);
          this.setSpecies(c.items);
        },
        error: (e) => {
          this.changeSpeciesState(ListLoadingStateEnum.UNKNOWN_ERROR);
        },
      }),
      catchError(() => EMPTY),
    ),
  );

  private readonly changeSpeciesState = this.updater(
    (state, result: ListLoadingStateEnum) => {
      return { ...state, speciesState: result };
    },
  );

  private readonly setSpecies = this.updater((state, items: Specie[]) => {
    return { ...state, species: items };
  });

  private readonly changeOwnerState = this.updater(
    (state, result: ListLoadingStateEnum) => {
      return { ...state, speciesState: result };
    },
  );

  private readonly setOwners = this.updater((state, items: Owner[]) => {
    return { ...state, owners: items };
  });
}
