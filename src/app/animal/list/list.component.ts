import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SpecieListStore } from './list.store';

@Component({
  templateUrl: './list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['list.component.scss'],
  providers: [SpecieListStore],
})
export class ListComponent implements OnInit {
  public displayedColumns = ['owner', 'specie', 'actions'];

  constructor(public readonly store: SpecieListStore) {}

  ngOnInit(): void {
    this.loadFirstPage();
  }

  public loadFirstPage() {
    this.store.fetchList({ page: 1, pageSize: 10 });
  }
}
