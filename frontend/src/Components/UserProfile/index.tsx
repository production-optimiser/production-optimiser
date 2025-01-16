// import React, { useState } from 'react';
// import { 
//   DropdownMenu, 
//   DropdownMenuContent, 
//   DropdownMenuItem, 
//   DropdownMenuTrigger 
// } from "@/Components/ui/dropdown-menu";
// import { 
//   Dialog, 
//   DialogContent, 
//   DialogHeader, 
//   DialogTitle, 
//   DialogFooter 
// } from "@/Components/ui/dialog";
// import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
// import { Button } from "@/Components/ui/button";
// import { Input } from "@/Components/ui/input";
// import { Label } from "@/Components/ui/label";
// import { Clock, LogOut, ChevronDown } from 'lucide-react';
// import { router } from '@/router/routes';
// import axiosInstance from '../../utils/axios';
// import { authService } from '@/services/auth';
// import axios from 'axios';

// export interface UserProfileProps {
//   name?: string;
//   email?: string;
//   role?: string;
//   onLogout?: () => void;
//   onAccountClick?: () => void;
// }

// interface temp{
//   password?: string
// }

// export const UserProfile: React.FC<UserProfileProps> = ({
//   name = '',
//   email = '',
//   role = 'customer',
//   onLogout,
//   onAccountClick = () => {}
// }) => {
//   const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
//   const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
//   const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
//   const [newEmail, setNewEmail] = useState('');
//   const [confirmEmail, setConfirmEmail] = useState('');
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   const initials = React.useMemo(() => {
//     if (!name || typeof name !== 'string') return '?';
//     return name
//       .split(' ')
//       .map(word => word[0])
//       .filter(char => char)
//       .join('')
//       .toUpperCase() || '?';
//   }, [name]);

//   const handleLogout = () => {
//     if (onLogout) onLogout();
//     router.navigate('/login');
//   };

//   const handleAccountClick = async () => {
//     setIsAccountDialogOpen(true);
//   };

//   const handleEmailChange = async () => {
//     setError('');
//     setSuccessMessage('');
//     if (newEmail !== confirmEmail) {
//       setError('Emails do not match');
//       return;
//     }
//     const currentUser = authService.getCurrentUser();

//     try {
//       const params = {
//         email: newEmail,
//       };
//       const response = await axiosInstance.patch(`/users/${currentUser?.id}`, null, { params });

//       if (response.status === 200) {
//         setSuccessMessage('Email updated successfully. Please log in with your new email.');
//         setTimeout(() => {
//           setIsEmailDialogOpen(false);
//           handleLogout(); 
//         }, 2000);
//       } else {
//         setError('Failed to update email');
//       }
//     } catch (err) {
//       setError('An error occurred');
//     }
//   };

//   const handlePasswordChange = async () => {
//     if (newPassword !== confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }
  
//     const currentUser = authService.getCurrentUser();
//     if (!currentUser) {
//       setError('User session not found');
//       return;
//     }
  
//     try {
//       const params = {
//         password: newPassword,
//       };
      
//       const response = await axiosInstance.patch(`/users/${currentUser.id}`, null, { params });

//       if (response.status === 200) {
//         setSuccessMessage('Password updated successfully');
//         setTimeout(() => {
//           setIsPasswordDialogOpen(false);
//           setNewPassword('');
//           setConfirmPassword('');
//         }, 2000);
//       } else {
//         setError('Failed to update password');
//       }
     
//     } catch (err) {
     
//       setError('An error occurred while updating password');
//     }
//   };

//   const handleEmailDialogChange = (open: boolean) => {
//     if (!open) {
//       setNewEmail('');
//       setConfirmEmail('');
//       setError('');
//       setSuccessMessage('');
//     }
//     setIsEmailDialogOpen(open);
//   };

//   const handlePasswordDialogChange = (open: boolean) => {
//     if (!open) {
//       setNewPassword('');
//       setConfirmPassword('');
//       setError('');
//       setSuccessMessage('');
//     }
//     setIsPasswordDialogOpen(open);
//   };

//   const handleAccountDialogChange = (open: boolean) => {
//     setIsAccountDialogOpen(open);
//     if (!open) {
//       setError('');
//       setSuccessMessage('');
//     }
//   };
//   return (
//     <>
//      <DropdownMenu>
//   <DropdownMenuTrigger className="w-full outline-none">
//     <div className="flex items-center justify-between px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
//       <div className="flex items-center gap-3">
//         <Avatar className="h-8 w-8">
//           <AvatarFallback>{initials}</AvatarFallback>
//         </Avatar>
//         <div className="flex flex-col items-start">
//           <span className="text-sm font-medium">{email}</span>
//           <span className="text-xs text-gray-500">{role}</span>
//         </div>
//       </div>
//       <ChevronDown className="h-4 w-4 text-gray-500" />
//     </div>
//   </DropdownMenuTrigger>
//         <DropdownMenuContent align="end">
//           <div className="px-2 py-1.5">
//             <p className="text-sm font-medium">{email}</p>
//             <p className="text-xs text-muted-foreground">{role}</p>
//           </div>
//           <DropdownMenuItem onClick={handleAccountClick}>Account</DropdownMenuItem>
//           <DropdownMenuItem onClick={handleLogout}>
//             <LogOut className="mr-2 h-4 w-4" />
//             Log out
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>

//       {/* Account Options Dialog */}
//       <Dialog open={isAccountDialogOpen} onOpenChange={handleAccountDialogChange}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Account Settings</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <Button 
//               className="w-full" 
//               onClick={() => {
//                 handleAccountDialogChange(false);
//                 handleEmailDialogChange(true);
//               }}
//             >
//               Change Email
//             </Button>
//             <Button 
//               className="w-full"
//               onClick={() => {
//                 handleAccountDialogChange(false);
//                 handlePasswordDialogChange(true);
//               }}
//             >
//               Change Password
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Email Change Dialog */}
//       <Dialog open={isEmailDialogOpen} onOpenChange={handleEmailDialogChange}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Change Email</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div>
//               <Label>Current Email</Label>
//               <Input value={email} disabled />
//             </div>
//             <div>
//               <Label>New Email</Label>
//               <Input
//                 value={newEmail}
//                 onChange={(e) => setNewEmail(e.target.value)}
//                 type="email"
//               />
//             </div>
//             <div>
//               <Label>Confirm New Email</Label>
//               <Input
//                 value={confirmEmail}
//                 onChange={(e) => setConfirmEmail(e.target.value)}
//                 type="email"
//               />
//             </div>
//             {error && <p className="text-red-500 text-sm">{error}</p>}
//             {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
//           </div>
//           <DialogFooter>
//             <Button onClick={handleEmailChange}>Save Changes</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Password Change Dialog */}
//       <Dialog open={isPasswordDialogOpen} onOpenChange={handlePasswordDialogChange}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Change Password</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
    
//             <div>
//               <Label>New Password</Label>
//               <Input
//                 type="password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//               />
//             </div>
//             <div>
//               <Label>Confirm New Password</Label>
//               <Input
//                 type="password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//               />
//             </div>
//             {error && <p className="text-red-500 text-sm">{error}</p>}
//             {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
//           </div>
//           <DialogFooter>
//             <Button onClick={handlePasswordChange}>Save Changes</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

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
import { LogOut, ChevronDown } from 'lucide-react';
import { router } from '@/router/routes';
import axiosInstance from '../../utils/axios';
import { authService } from '@/services/auth';

export interface UserProfileProps {
  name?: string;
  email?: string;
  role?: string;
  onLogout?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  name = '',
  email = '',
  role = 'customer',
  onLogout,
}) => {
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

  const handleAccountDialogChange = (open: boolean) => {
    setIsAccountDialogOpen(open);
    if (!open) {
      setError('');
      setSuccessMessage('');
    }
  };

  const handleEmailDialogChange = (open: boolean) => {
    if (!open) {
      setNewEmail('');
      setConfirmEmail('');
      setError('');
      setSuccessMessage('');
    }
    setIsEmailDialogOpen(open);
  };

  const handlePasswordDialogChange = (open: boolean) => {
    if (!open) {
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setSuccessMessage('');
    }
    setIsPasswordDialogOpen(open);
  };

  const handleEmailChange = async () => {
    setError('');
    setSuccessMessage('');
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
        setSuccessMessage('Email updated successfully. Please log in with your new email.');
        setTimeout(() => {
          setIsEmailDialogOpen(false);
          handleLogout();
        }, 2000);
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
        setSuccessMessage('Password updated successfully');
        setTimeout(() => {
          setIsPasswordDialogOpen(false);
          setNewPassword('');
          setConfirmPassword('');
        }, 2000);
      } else {
        setError('Failed to update password');
      }
    } catch (err) {
      setError('An error occurred while updating password');
    }
  };

  const handleDeleteAccount = async () => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      setError('User session not found');
      return;
    }

    try {
      const response = await axiosInstance.delete(`/users/${currentUser.id}`);
      if (response.status === 200) {
        setSuccessMessage('Account deleted successfully. Logging out...');
        setTimeout(() => {
          handleLogout();
        }, 2000);
      } else {
        setError('Failed to delete account');
      }
    } catch (err) {
      setError('An error occurred while deleting the account');
    }
  };

  const handleDownloadGDPRData = async () => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      setError('User session not found');
      return;
    }

    try {
      const response = await axiosInstance.get(`/users/${currentUser.id}/audit`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'GDPR_Data.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError('An error occurred while downloading GDPR data');
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
          <DropdownMenuItem onClick={() => setIsAccountDialogOpen(true)}>Account</DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Account Options Dialog */}
      <Dialog open={isAccountDialogOpen} onOpenChange={handleAccountDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Button
              className="w-full"
              onClick={() => {
                handleAccountDialogChange(false);
                handleEmailDialogChange(true);
              }}
            >
              Change Email
            </Button>
            <Button
              className="w-full"
              onClick={() => {
                handleAccountDialogChange(false);
                handlePasswordDialogChange(true);
              }}
            >
              Change Password
            </Button>
            <Button className="w-full" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
            <Button className="w-full" onClick={handleDownloadGDPRData}>
              Download GDPR Data
            </Button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
        </DialogContent>
      </Dialog>

      {/* Email Change Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={handleEmailDialogChange}>
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
            {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
          </div>
          <DialogFooter>
            <Button onClick={handleEmailChange}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Change Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={handlePasswordDialogChange}>
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
            {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
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
