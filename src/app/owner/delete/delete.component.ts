import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Owner } from '../../@models/owner';
import { OwnerDeleteStore } from './delete.store';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-owner-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [OwnerDeleteStore],
})
export class DeleteComponent implements OnInit, OnDestroy {
  @Input() owner?: Owner;
  @Output() deleted: EventEmitter<void> = new EventEmitter();
  deletedSubs?: Subscription;

  constructor(public readonly store: OwnerDeleteStore) {}

  ngOnInit() {
    this.deletedSubs = this.store.isDeleted$
      .pipe(filter((d) => d))
      .subscribe(() => this.deleted.emit());
  }

  ngOnDestroy() {
    this.deletedSubs?.unsubscribe();
  }

  deleteEntity() {
    this.owner && this.store.deleteOwner(this.owner.id);
  }
}
