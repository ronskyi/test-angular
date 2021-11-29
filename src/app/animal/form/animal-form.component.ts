import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Animal, Pet, WildAnimal } from '@models/animal';
import { Subscription } from 'rxjs';
import { AnimalFormStore } from './animal-form.store';
import { Owner } from '@models/owner';
import { Specie } from '@models/specie';

@Component({
  selector: 'app-animal-form',
  templateUrl: './animal-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AnimalFormStore],
})
export class AnimalFormComponent implements OnInit, OnDestroy {
  @Input('data') item?: Animal;
  @Output() onSave: EventEmitter<Animal> = new EventEmitter<Animal>();
  animalForm: FormGroup;
  typeSubs?: Subscription;
  ownerFilterSubs?: Subscription;
  specieFilterSubs?: Subscription;

  constructor(
    public readonly store: AnimalFormStore,
    private readonly formBuilder: FormBuilder,
  ) {
    this.animalForm = formBuilder.group({
      type: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      specieFilter: [''],
      specie: ['', [Validators.required]],
      vaccinated: ['', [Validators.required]],
      ownerFilter: [''],
      owner: [''],
      trackingId: [''],
    });
  }

  get currentOwner(): Owner | undefined {
    if (this.item?.type !== 'Pet') {
      return;
    }
    return (this.item as Pet)?.owner;
  }

  get currentSpecie(): Specie | undefined {
    return this.item?.specie;
  }

  ngOnInit(): void {
    if (this.item) {
      this.fillFormFromAnimal(this.item);
    }
    this.typeSubs = this.animalForm
      .get('type')
      ?.valueChanges.subscribe((event) => {
        this.animalForm.get('owner')?.setValidators([]);
        this.animalForm.get('trackingId')?.setValidators([]);
        switch (event.value) {
          case 'Pet':
            this.animalForm.get('owner')?.setValidators([Validators.required]);
            break;
          case 'WildAnimal':
            this.animalForm
              .get('trackingId')
              ?.setValidators([Validators.required]);
            break;
        }
        this.animalForm.get('owner')?.updateValueAndValidity();
        this.animalForm.get('trackingId')?.updateValueAndValidity();
      });
    this.ownerFilterSubs = this.animalForm
      .get('ownerFilter')
      ?.valueChanges.subscribe((event) => {
        this.store.updateOwnersWithKeyword(event);
      });
    this.specieFilterSubs = this.animalForm
      .get('specieFilter')
      ?.valueChanges.subscribe((event) => {
        this.store.updateSpeciesWithKeyword(event);
      });
  }

  ngOnDestroy() {
    this.typeSubs?.unsubscribe();
    this.ownerFilterSubs?.unsubscribe();
    this.specieFilterSubs?.unsubscribe();
  }

  get animalType() {
    return this.animalForm.get('type')?.value;
  }

  formSubmit(): void {
    if (!this.animalForm.valid) {
      return;
    }
    console.log(this.createAnimalFromForm());
    this.onSave.emit(this.createAnimalFromForm());
  }

  private fillFormFromAnimal(item: Animal): void {
    this.animalForm.get('type')?.setValue(item.type);
    this.animalForm.get('vaccinated')?.setValue(item.vaccinated);
    this.animalForm.get('birthday')?.setValue(item.birthday);
    this.animalForm.get('specie')?.setValue(item.specie);
    if (item.type === 'Pet' && (item as Pet).owner) {
      this.animalForm.get('owner')?.setValue((item as Pet).owner);
    }
    if (item.type === 'WildAnimal' && (item as WildAnimal).trackingId) {
      this.animalForm
        .get('trackingId')
        ?.setValue((item as WildAnimal).trackingId);
    }
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
          owner: this.animalForm.get('owner')?.value,
        });
        break;
      case 'WildAnimal':
        Object.assign(animal, {
          trackingId: this.animalForm.get('trackingId')?.value,
        });
        break;
    }
    return animal;
  }
}
