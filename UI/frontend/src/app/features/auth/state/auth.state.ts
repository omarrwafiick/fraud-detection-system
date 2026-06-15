export interface User {
}

export interface AuthState {
  user: Partial<User>;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: {},
  loading: false,
  error: null
};