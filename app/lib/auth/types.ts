export type AuthView = 'login' | 'register' | 'forgot';

export type AuthIntent = 'save_pattern' | 'like' | 'comment';

export interface OpenAuthOptions {
  callbackUrl?: string;
  intent?: AuthIntent;
}

const AUTH_VIEWS: AuthView[] = ['login', 'register', 'forgot'];
const AUTH_INTENTS: AuthIntent[] = ['save_pattern', 'like', 'comment'];

export function parseAuthView(value: string | null): AuthView | null {
  if (value && AUTH_VIEWS.includes(value as AuthView)) {
    return value as AuthView;
  }
  return null;
}

export function parseAuthIntent(value: string | null): AuthIntent | undefined {
  if (value && AUTH_INTENTS.includes(value as AuthIntent)) {
    return value as AuthIntent;
  }
  return undefined;
}
