import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import { Clock, LogOut, ChevronDown } from 'lucide-react';

export interface UserProfileProps {
  name: string;
  email: string;
  role?: string;
  onLogout?: () => void;
  onAccountClick?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ 
  name, 
  email,
  role = 'customer', 
  onLogout = () => {}, 
  onAccountClick = () => {} 
}) => {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();

  return (
    <div className="px-2 py-3">
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full outline-none">
          <div className="flex items-center justify-between px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/api/placeholder/32/32" alt={name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{email}</span>
                <span className="text-xs text-gray-500">{role}</span>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="end">
          <DropdownMenuItem 
            onClick={onAccountClick}
            className="flex items-center cursor-pointer"
          >
            <Clock className="mr-2 h-4 w-4" />
            <span>Account</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={onLogout}
            className="flex items-center cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserProfile;
