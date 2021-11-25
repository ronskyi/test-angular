import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Collection } from '@models/collection';
import { Specie } from '@models/specie';

@Injectable()
export class SpecieService {
  public constructor(private readonly http: HttpClient) {
  }

  public fetchList(keyword: string, pageNumber: number, pageSize: number): Observable<Collection<Specie>> {
    const params = {
      page: pageNumber,
      page_size: pageSize,
    };
    if (keyword && keyword !== '') {
      Object.assign(params, {
        keyword
      })
    }
    return this.http.get<Collection<Specie>>('/species', { params });
  }

  public create(specie: Specie): Observable<Specie> {
    const data = {
      label: specie.label,
    };
    return this.http.post<Specie>('/species', data);
  }

  public update(specie: Specie): Observable<Specie> {
    const data = {
      label: specie.label,
    };
    return this.http.put<Specie>(`/species/${specie.id}`, data);
  }

  public fetchById(id: string): Observable<Specie> {
    return this.http.get<Specie>(`/species/${id}`);
  }

  public delete(id: string): Observable<boolean> {
    return this.http.delete(`/species/${id}`, {observe: 'response'}).pipe(
      map(r => r.status === 204)
    );
  }
}

