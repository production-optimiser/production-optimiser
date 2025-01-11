import React, { useState } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/Components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/Components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Clock, LogOut, ChevronDown } from 'lucide-react';
import { router } from '@/router/routes';
import axiosInstance from '../../utils/axios';
import { authService } from '@/services/auth';
import axios from 'axios';

export interface UserProfileProps {
  name?: string;
  email?: string;
  role?: string;
  onLogout?: () => void;
  onAccountClick?: () => void;
}

interface temp{
  password?: string
}

export const UserProfile: React.FC<UserProfileProps> = ({
  name = '',
  email = '',
  role = 'customer',
  onLogout,
  onAccountClick = () => {}
}) => {
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const initials = React.useMemo(() => {
    if (!name || typeof name !== 'string') return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .filter(char => char)
      .join('')
      .toUpperCase() || '?';
  }, [name]);

  const handleLogout = () => {
    if (onLogout) onLogout();
    router.navigate('/login');
  };

  const handleAccountClick = async () => {
    setIsAccountDialogOpen(true);
  };

  const handleEmailChange = async () => {
    if (newEmail !== confirmEmail) {
      setError('Emails do not match');
      return;
    }
    const currentUser = authService.getCurrentUser();

    try {
      const params = {
        email: newEmail,
      };
      const response = await axiosInstance.patch(`/users/${currentUser?.id}`, null, { params });

      if (response.status === 200) {
        setIsEmailDialogOpen(false);
        router.navigate('/login');
      } else {
        setError('Failed to update email');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      setError('User session not found');
      return;
    }
  
    try {
      const params = {
        password: newPassword,
      };
      
      const response = await axiosInstance.patch(`/users/${currentUser.id}`, null, { params });

      if (response.status === 200) {
        setIsPasswordDialogOpen(false);
        router.navigate('/login');
      } else {
        setError('Failed to update password');
      }
     
    } catch (err) {
     
      setError('An error occurred while updating password');
    }
  };

  return (
    <>
     <DropdownMenu>
  <DropdownMenuTrigger className="w-full outline-none">
    <div className="flex items-center justify-between px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
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
        <DropdownMenuContent align="end">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">{email}</p>
            <p className="text-xs text-muted-foreground">{role}</p>
          </div>
          <DropdownMenuItem onClick={handleAccountClick}>Account</DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Account Options Dialog */}
      <Dialog open={isAccountDialogOpen} onOpenChange={setIsAccountDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Button 
              className="w-full" 
              onClick={() => {
                setIsAccountDialogOpen(false);
                setIsEmailDialogOpen(true);
              }}
            >
              Change Email
            </Button>
            <Button 
              className="w-full"
              onClick={() => {
                setIsAccountDialogOpen(false);
                setIsPasswordDialogOpen(true);
              }}
            >
              Change Password
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Change Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Current Email</Label>
              <Input value={email} disabled />
            </div>
            <div>
              <Label>New Email</Label>
              <Input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                type="email"
              />
            </div>
            <div>
              <Label>Confirm New Email</Label>
              <Input
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                type="email"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <DialogFooter>
            <Button onClick={handleEmailChange}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Change Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
    
            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <DialogFooter>
            <Button onClick={handlePasswordChange}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserProfile;