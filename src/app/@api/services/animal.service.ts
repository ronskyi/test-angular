import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Collection } from '../../@models/collection';
import { Animal, Pet, WildAnimal } from '../../@models/animal';

@Injectable()
export class AnimalService {
  public constructor(private readonly http: HttpClient) {
  }

  public fetchList(pageNumber: number, pageSize: number): Observable<Collection<Animal>> {
    return this.http.get<Collection<Animal>>('/animals', {
      params: {
        page: pageNumber,
        page_size: pageSize,
      },
    });
  }

  public create(item: Animal): Observable<Animal> {
    return this.http.post<Animal>(
      '/animals',
      AnimalService.mapItemToData(item),
    );
  }

  public update(item: Animal): Observable<Animal> {
    return this.http.put<Animal>(
      `/animals/${item.id}`,
      AnimalService.mapItemToData(item),
    );
  }

  public fetchById(id: string): Observable<Animal> {
    return this.http.get<Animal>(`/animals/${id}`);
  }

  public delete(id: string): Observable<boolean> {
    return this.http.delete(`/animals/${id}`, {observe: 'response'}).pipe(
      map(r => r.status === 204)
    );
  }

  private static mapItemToData(item: Animal) {
    const data = {
      birthday: item.birthday,
      type: item.type,
      specie: item.specie,
      vaccinated: item.vaccinated,
    };
    switch (item.type) {
      case 'Pet':
        Object.assign(data, {
          owner: (item as Pet).owner.id
        });
        break;
      case 'WildAnimal':
        Object.assign(data, {
          trackingId: (item as WildAnimal).trackingId
        });
        break;
    }
    return data;
  }
}

