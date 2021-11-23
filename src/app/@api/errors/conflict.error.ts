import { ApiError } from './api.error';

export class ConflictError extends ApiError {
  private _errors: string[];

  constructor(responseBody: unknown) {
    super();
    this._errors = responseBody as string[];
  }

  get errors(): string[] {
    return this._errors;
  }
}
