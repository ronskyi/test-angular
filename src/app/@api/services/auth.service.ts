import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { JWT } from '@models/jwt';
import { JwtHelperService } from '@auth0/angular-jwt';

interface JWTResponse {
  sub: string;
  exp: number;
  iat: number;
  email: string;
  roles: string[];
}

@Injectable()
export class AuthService {
  public constructor(
    private readonly http: HttpClient,
    private readonly jwtHelper: JwtHelperService
  ) {
  }

  public getJwt(username: string, password: string): Observable<{ token: string; tokenData: JWT }> {
    return this.http.post<{ access_token: string }>('/login', {
      username,
      password
    }).pipe(
      map((res: { access_token: string }) => {
        const jwtData = this.jwtHelper.decodeToken<JWTResponse>(
          res.access_token,
        );
        return {
          tokenData: {
            ...jwtData,
            exp: new Date(jwtData.exp * 1000),
            iat: new Date(jwtData.iat * 1000),
          } as JWT,
          token: res.access_token,
        };
      }),
    );
  }
}

