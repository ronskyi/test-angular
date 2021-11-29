import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { first, mergeMap } from 'rxjs/operators';
import { selectToken } from '../../auth/@store/auth.selectors';

@Injectable()
export class ApiAuthInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  intercept(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: HttpRequest<any>,
    next: HttpHandler,
  ): // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Observable<HttpEvent<any>> {
    return this.addToken(req).pipe(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mergeMap((requestWithToken: HttpRequest<any>) =>
        next.handle(requestWithToken),
      ),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private addToken(request: HttpRequest<any>): Observable<HttpRequest<any>> {
    return this.store.select<string | undefined>(selectToken).pipe(
      first(),
      mergeMap((token: string | undefined) => {
        if (token) {
          // add token to request
          request = request.clone({
            headers: request.headers.set('Authorization', `Bearer ${token}`),
          });
        }
        return of(request);
      }),
    );
  }
}
