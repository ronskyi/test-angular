import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Animal } from '@models/animal';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-animal-form',
  templateUrl: './animal-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimalFormComponent implements OnInit, OnDestroy {

  @Input('data') item?: Animal;
  @Output() onSave: EventEmitter<Animal> = new EventEmitter<Animal>();
  animalForm: FormGroup;
  typeSubs?: Subscription;

  constructor(
    private readonly formBuilder: FormBuilder
  ) {
    this.animalForm = formBuilder.group({
      'type': ['Pet', [Validators.required]],
      'birthday': ['', [Validators.required]],
      'specie': ['', [Validators.required]],
      'vaccinated': ['', [Validators.required]],
      'owner': ['', []],
      'trackingId': ['', []],
    });
  }

  ngOnInit(): void {
    if (this.item) {
      this.fillFormFromAnimal(this.item);
    }
    this.typeSubs = this.animalForm.get('type')?.valueChanges.subscribe((event) => {
      this.animalForm.get('owner')?.setValidators([]);
      this.animalForm.get('trackingId')?.setValidators([]);
      switch (event.value) {
        case 'Pet':
          this.animalForm.get('owner')?.setValidators([Validators.required]);
          break;
        case 'WildAnimal':
          this.animalForm.get('trackingId')?.setValidators([Validators.required]);
          break;
      }
    })
  }

  ngOnDestroy() {
    this.typeSubs?.unsubscribe();
  }

  get animalType() {
    return this.animalForm.get('type')?.value;
  }

  formSubmit(): void {
    if (!this.animalForm.valid) {
      return;
    }
    this.onSave.emit(this.createAnimalFromForm());
  }

  private fillFormFromAnimal(item: Animal): void {
    this.animalForm.get('vaccinated')?.setValue(item.vaccinated);
  }

  private createAnimalFromForm(): Animal {
    const animal = {
      type: this.animalForm.get('type')?.value,
      birthday: this.animalForm.get('birthday')?.value,
      specie: this.animalForm.get('specie')?.value,
      vaccinated: this.animalForm.get('vaccinated')?.value,
    } as Animal;
    switch (this.animalType) {
      case 'Pet':
        Object.assign(animal, {
          owner: this.animalForm.get('owner')
        });
        break;
      case 'WildAnimal':
        Object.assign(animal, {
          trackingId: this.animalForm.get('trackingId')
        });
        break;
    }
    return animal;
  }
}
