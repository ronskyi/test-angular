import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Specie } from '../../@models/specie';

@Component({
  selector: 'app-specie-form',
  templateUrl: './specie-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpecieFormComponent implements OnInit {
  @Input('data') specie?: Specie;
  @Output() onSave: EventEmitter<Specie> = new EventEmitter<Specie>();

  specieForm: FormGroup;

  constructor(private readonly formBuilder: FormBuilder) {
    this.specieForm = formBuilder.group({
      label: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  ngOnInit(): void {
    if (this.specie) {
      this.fillFormFromSpecie(this.specie);
    }
  }

  formSubmit(): void {
    if (!this.specieForm.valid) {
      return;
    }
    this.onSave.emit(this.createSpecieFromForm());
  }

  private fillFormFromSpecie(owner: Specie): void {
    this.specieForm.get('label')?.setValue(owner.label);
  }

  private createSpecieFromForm(): Specie {
    return {
      label: this.specieForm.get('label')?.value,
    } as Specie;
  }
}
