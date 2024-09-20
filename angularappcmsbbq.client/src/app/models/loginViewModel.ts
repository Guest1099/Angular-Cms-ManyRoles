
export interface LoginViewModel {
  email: string;
  password: string;
  token?: string;
  expirationTimeToken?: string;

  role?: string;
  //dataZalogowania?: string;
  //dataWylogowania?: string;
}
