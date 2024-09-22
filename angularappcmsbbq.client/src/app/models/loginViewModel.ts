
export interface LoginViewModel {
  userId?: string;
  email: string;
  password: string;
  token?: string;
  expirationTimeToken?: string;

  role?: string;
}
