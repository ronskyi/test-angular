import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { CreateSpecieStore } from './create.store';
import { filter, Subscription } from 'rxjs';
import { Specie } from '../../@models/specie';

@Component({
  templateUrl: './create.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CreateSpecieStore],
})
export class CreateComponent implements OnInit, OnDestroy {
  createdIdSub?: Subscription;

  constructor(
    private readonly store: CreateSpecieStore,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.createdIdSub = this.store.createdId$
      .pipe(filter((id) => !!id))
      .subscribe((id) => {
        void this.router.navigate(['/species', id]);
      });
  }

  ngOnDestroy(): void {
    this.createdIdSub?.unsubscribe();
  }

  createItem(owner: Specie) {
    this.store.create(owner);
  }
}
