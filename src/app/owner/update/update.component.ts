import { Component, OnInit } from '@angular/core';
import { UpdateOwnerStore } from './update.store';
import { Owner } from '../../@models/owner';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  providers: [UpdateOwnerStore],
})
export class UpdateComponent implements OnInit {
  constructor(
    public readonly store: UpdateOwnerStore,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.store.fetchOwner(this.activatedRoute.snapshot.params['id']);
  }

  updateOwner(owner: Owner) {
    this.store.update(owner);
  }

  returnToList() {
    void this.router.navigate(['/owners']);
  }
}
