import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Owner } from '../../@models/owner';

@Component({
  selector: 'app-owner-form',
  templateUrl: './owner-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerFormComponent implements OnInit {
  @Input('data') owner?: Owner;
  @Output() onSave: EventEmitter<Owner> = new EventEmitter<Owner>();

  ownerForm: FormGroup;

  constructor(private readonly formBuilder: FormBuilder) {
    this.ownerForm = formBuilder.group({
      fullName: ['', [Validators.required, Validators.maxLength(100)]],
      city: ['', [Validators.required, Validators.maxLength(50)]],
      street: ['', [Validators.required, Validators.maxLength(50)]],
      country: ['', [Validators.required, Validators.maxLength(50)]],
      zipCode: ['', [Validators.required, Validators.maxLength(10)]],
    });
  }

  ngOnInit(): void {
    if (this.owner) {
      this.fillFormFromOwner(this.owner);
    }
  }

  formSubmit(): void {
    if (!this.ownerForm.valid) {
      return;
    }
    this.onSave.emit(this.createOwnerFromForm());
  }

  private fillFormFromOwner(owner: Owner): void {
    this.ownerForm.get('fullName')?.setValue(owner.fullName);
    this.ownerForm.get('city')?.setValue(owner.address.city);
    this.ownerForm.get('street')?.setValue(owner.address.street);
    this.ownerForm.get('zipCode')?.setValue(owner.address.zipCode);
    this.ownerForm.get('country')?.setValue(owner.address.country);
  }

  private createOwnerFromForm(): Owner {
    return {
      fullName: this.ownerForm.get('fullName')?.value,
      address: {
        city: this.ownerForm.get('city')?.value,
        street: this.ownerForm.get('street')?.value,
        country: this.ownerForm.get('country')?.value,
        zipCode: this.ownerForm.get('zipCode')?.value,
      },
    } as Owner;
  }
}
