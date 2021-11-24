import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DeleteAnimalStore } from './delete.store';
import { filter, Subscription } from 'rxjs';
import { Animal } from '@models/animal';

@Component({
  selector: 'app-animal-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DeleteAnimalStore]
})
export class DeleteComponent implements OnInit, OnDestroy {

  @Input() item?: Animal;
  @Output() onDeleted: EventEmitter<void> = new EventEmitter();
  deletedSubs?: Subscription;

  constructor(public readonly store: DeleteAnimalStore) { }

  ngOnInit() {
    this.deletedSubs = this.store.isDeleted$.pipe(
      filter(d => d)
    ).subscribe(() => this.onDeleted.emit())
  }

  ngOnDestroy() {
    this.deletedSubs?.unsubscribe();
  }

  deleteEntity() {
    if (!this.item?.id) {
      return;
    }
    this.item && this.store.deleteItem(this.item.id);
  }

}
