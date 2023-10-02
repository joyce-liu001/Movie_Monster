export enum AuthUserStatus {
  LOGIN = 'login',
  LOGOUT = 'logout',
  LOADING = 'loading',
}

export enum AuthType {
  USER = 'user',
  ADMIN = 'admin',
}

export interface AuthUserType {
  username: string;
  uId: string;
  email: string;
  token: string | null;
  role: AuthType | null;
  image: string | null;
  status: AuthUserStatus;
}
