import { Specie } from './specie';
import { Owner } from './owner';

export interface Animal {
  id?: string;
  type: 'WildAnimal' | 'Pet';
  birthday: Date;
  specie: Specie;
  vaccinated: boolean;
}

export interface Pet extends Animal {
  type: 'Pet';
  owner: Owner;
}

export interface WildAnimal extends Animal {
  type: 'WildAnimal';
  trackingId: string;
}
