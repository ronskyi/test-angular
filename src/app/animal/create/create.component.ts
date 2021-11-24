import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CreateSpecieStore } from './create.store';
import { filter, Subscription } from 'rxjs';
import { Animal } from '@models/animal';

@Component({
  templateUrl: './create.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CreateSpecieStore]
})
export class CreateComponent implements OnInit, OnDestroy {

  createdIdSub?: Subscription;

  constructor(
    private readonly store: CreateSpecieStore,
    private readonly router: Router
  ) {
  }

  ngOnInit(): void {
    this.createdIdSub = this.store.createdId$.pipe(
      filter(id => !!id)
    ).subscribe((id) => {
      void this.router.navigate(['/animals', id])
    });
  }

  ngOnDestroy(): void {
    this.createdIdSub?.unsubscribe();
  }

  createItem(item: Animal) {
    this.store.create(item);
  }
}
