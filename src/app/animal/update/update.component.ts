import { Component, OnInit } from '@angular/core';
import { UpdateAnimalStore } from './update.store';
import { ActivatedRoute, Router } from '@angular/router';
import { Animal } from '@models/animal';

@Component({
  templateUrl: './update.component.html',
  providers: [UpdateAnimalStore],
})
export class UpdateComponent implements OnInit {
  constructor(
    public readonly store: UpdateAnimalStore,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.store.fetchItem(this.activatedRoute.snapshot.params['id']);
  }

  updateItem(item: Animal) {
    this.store.update(item);
  }

  returnToList() {
    void this.router.navigate(['/animals']);
  }
}
