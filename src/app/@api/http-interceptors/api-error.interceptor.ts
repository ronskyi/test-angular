import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  BadRequestError,
  NotFoundError,
  UnknownError,
  NetworkError,
  ConflictError,
} from '../errors';
import { Store } from '@ngrx/store';
import { UnauthorizedError } from '@api/errors/unauthorized.error';

@Injectable()
export class ApiErrorInterceptor implements HttpInterceptor {
  public constructor(private readonly store: Store) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ErrorEvent) {
          throw new NetworkError(error.message);
        }
        switch (error.status) {
          case 400:
            throw new BadRequestError(error.error);
          case 401:
            throw new UnauthorizedError(error.statusText);
          case 404:
            throw new NotFoundError(error.statusText);
          case 409:
            throw new ConflictError(error.error);
          default:
            throw new UnknownError(error.statusText);
        }
      }),
    );
  }
}
