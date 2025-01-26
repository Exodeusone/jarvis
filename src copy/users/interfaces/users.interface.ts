export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  kind: 'admin' | 'user';
}

export const validUserKeys: Record<keyof User, boolean> = {
  id: true,
  username: true,
  email: true,
  password: true,
  kind: true,
};
