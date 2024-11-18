export type Role = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  roles: Role[];
}

export interface LoginPageProps {
  onContactClick: () => void;
}

export interface ContactFormProps {
  onBackClick: () => void;
}
