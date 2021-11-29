import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { CreateOwnerStore } from './create.store';
import { filter, Subscription } from 'rxjs';
import { Owner } from '../../@models/owner';

@Component({
  templateUrl: './create.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CreateOwnerStore],
})
export class CreateComponent implements OnInit, OnDestroy {
  createdIdSub?: Subscription;

  constructor(
    private readonly store: CreateOwnerStore,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.createdIdSub = this.store.createdId$
      .pipe(filter((id) => !!id))
      .subscribe((id) => {
        void this.router.navigate(['/owners', id]);
      });
  }

  ngOnDestroy(): void {
    this.createdIdSub?.unsubscribe();
  }

  createOwner(owner: Owner) {
    this.store.create(owner);
  }
}
