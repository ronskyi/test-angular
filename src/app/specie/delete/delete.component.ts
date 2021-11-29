import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { SpecieDeleteStore } from './delete.store';
import { filter, Subscription } from 'rxjs';
import { Specie } from '../../@models/specie';

@Component({
  selector: 'app-specie-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SpecieDeleteStore],
})
export class DeleteComponent implements OnInit, OnDestroy {
  @Input() item?: Specie;
  @Output() onDeleted: EventEmitter<void> = new EventEmitter();
  deletedSubs?: Subscription;

  constructor(public readonly store: SpecieDeleteStore) {}

  ngOnInit() {
    this.deletedSubs = this.store.isDeleted$
      .pipe(filter((d) => d))
      .subscribe(() => this.onDeleted.emit());
  }

  ngOnDestroy() {
    this.deletedSubs?.unsubscribe();
  }

  deleteEntity() {
    this.item && this.store.deleteOwner(this.item.id);
  }
}
