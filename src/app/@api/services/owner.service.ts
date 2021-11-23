import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Collection } from '../../@models/collection';
import { Owner } from '../../@models/owner';

@Injectable()
export class OwnerService {
  public constructor(private readonly http: HttpClient) {
  }

  public fetchList(pageNumber: number, pageSize: number): Observable<Collection<Owner>> {
    return this.http.get<Collection<Owner>>('/owners', {
      params: {
        page: pageNumber,
        page_size: pageSize,
      },
    });
  }

  public create(owner: Owner): Observable<Owner> {
    const data = {
      fullName: owner.fullName,
      ...owner.address
    };
    return this.http.post<Owner>('/owners', data);
  }

  public update(owner: Owner): Observable<Owner> {
    const data = {
      fullName: owner.fullName,
      ...owner.address
    };
    return this.http.put<Owner>(`/owners/${owner.id}`, data);
  }

  public fetchById(id: string): Observable<Owner> {
    return this.http.get<Owner>(`/owners/${id}`);
  }

  public delete(id: string): Observable<boolean> {
    console.log(id)
    return this.http.delete(`/owners/${id}`, {observe: 'response'}).pipe(
      tap(r => console.log(r)),
      map(r => r.status === 204)
    );
  }
}

