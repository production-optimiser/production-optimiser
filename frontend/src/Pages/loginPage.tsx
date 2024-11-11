import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/Components/ui/card';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';

interface LoginPageProps {
  onContactClick: () => void;
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onContactClick, onLogin }) => {
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
        <Button 
          onClick={onLogin}
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
