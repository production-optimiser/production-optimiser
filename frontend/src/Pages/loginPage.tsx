// import React from 'react';
// import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/Components/ui/card';
// import { Label } from '@/Components/ui/label';
// import { Input } from '@/Components/ui/input';
// import { Button } from '@/Components/ui/button';

// interface LoginPageProps {
//   onContactClick: () => void;
//   onLogin: () => void;
// }

// const LoginPage: React.FC<LoginPageProps> = ({ onContactClick, onLogin }) => {
//   return (
//     <Card className="w-full max-w-md">
//       <CardHeader>
//         <CardTitle className="text-xl font-semibold">
//           Welcome to Production Optimiser
//         </CardTitle>
//         <p className="text-sm text-muted-foreground">
//           Sign in using credentials created by admin.
//         </p>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div className="space-y-2">
//           <Label htmlFor="email">Email</Label>
//           <Input
//             id="email"
//             type="email"
//             placeholder="m@example.com"
//           />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="password">Password</Label>
//           <Input
//             id="password"
//             type="password"
//           />
//         </div>
//         <Button 
//           onClick={onLogin}
//           className="w-full bg-amber-600 hover:bg-amber-700"
//         >
//           Login
//         </Button>
//       </CardContent>
//       <CardFooter className="flex justify-center">
//         <Button
//           variant="link"
//           className="text-sm text-muted-foreground"
//           onClick={onContactClick}
//         >
//           Contact us
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// };
// export default LoginPage;
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User } from '../types/auth';

interface LoginPageProps {
  onContactClick: () => void;
  onLogin: (userData: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onContactClick, onLogin }) => {
  const [userRole, setUserRole] = useState('CUSTOMER');

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      roles: [userRole as 'CUSTOMER' | 'ADMIN']
    };
    onLogin(mockUser);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Welcome to Production Optimiser
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Sign in using credentials created by admin.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
          />
        </div>
        <div className="space-y-2">
          <Label>Role Selection</Label>
          <RadioGroup defaultValue="CUSTOMER" onValueChange={setUserRole}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="CUSTOMER" id="customer" />
              <Label htmlFor="customer">Customer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ADMIN" id="admin" />
              <Label htmlFor="admin">Admin</Label>
            </div>
          </RadioGroup>
        </div>
        <Button
          onClick={handleSubmit}
          className="w-full bg-amber-600 hover:bg-amber-700"
        >
          Login
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          variant="link"
          className="text-sm text-muted-foreground"
          onClick={onContactClick}
        >
          Contact us
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginPage;