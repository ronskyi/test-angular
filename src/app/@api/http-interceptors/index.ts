import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiErrorInterceptor } from './api-error.interceptor';
import { ApiHostInterceptor } from './api-host.interceptor';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: ApiHostInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ApiErrorInterceptor, multi: true },
];
