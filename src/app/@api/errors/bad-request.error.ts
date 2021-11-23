import { ApiError } from './api.error';

export interface BadRequestErrors {
  [field: string]: string[];
}

export class BadRequestError extends ApiError {
  private _errors: BadRequestErrors;

  constructor(responseBody: unknown) {
    super();
    this._errors = responseBody as BadRequestErrors;
  }

  get errors(): BadRequestErrors {
    return this._errors;
  }
}
