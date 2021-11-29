import { Component, OnInit } from '@angular/core';
import { UpdateSpecieStore } from './update.store';
import { ActivatedRoute, Router } from '@angular/router';
import { Specie } from '../../@models/specie';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  providers: [UpdateSpecieStore],
})
export class UpdateComponent implements OnInit {
  constructor(
    public readonly store: UpdateSpecieStore,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.store.fetchOwner(this.activatedRoute.snapshot.params['id']);
  }

  updateSpecie(specie: Specie) {
    this.store.update(specie);
  }

  returnToList() {
    void this.router.navigate(['/owners']);
  }
}
