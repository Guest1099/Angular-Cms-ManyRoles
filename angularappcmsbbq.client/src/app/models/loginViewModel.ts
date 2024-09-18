
export interface LoginViewModel {
  email: string;
  password: string;
  token?: string;
  newToken?: string;
  expirationTimeToken?: string;
  expirationTimeNewToken?: string;

  role?: string;
  //dataZalogowania?: string;
  //dataWylogowania?: string;
}
