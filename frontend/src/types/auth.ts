export type Role = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  roles: Role[];
}
