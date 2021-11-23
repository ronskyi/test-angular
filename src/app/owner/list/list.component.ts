import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { OwnerListStore } from './list.store';

@Component({
  templateUrl: './list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['list.component.scss'],
  providers: [OwnerListStore]
})
export class ListComponent implements OnInit {

  public displayedColumns = [
    'fullName',
    'actions',
  ];

  constructor(
    public readonly store: OwnerListStore
  ) {
  }

  ngOnInit(): void {
    this.loadFirstPage();
  }

  public loadFirstPage() {
    this.store.fetchList({page: 1, pageSize: 10});
  }
}
