export interface JWT {
  sub: string;
  exp: Date;
  iat: Date;
  email: string;
  roles: string[];
}
