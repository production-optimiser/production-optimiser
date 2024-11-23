export interface UserProfileProps {
  name: string;
  email: string;
  role?: string;
  onLogout?: () => void;
  onAccountClick?: () => void;
}
