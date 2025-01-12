import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/Components/ui/card';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { authService } from '../services/auth';
import { useAuth } from '../Contexts/authContext';

interface LoginPageProps {
  onContactClick: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onContactClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setError('');
    try {
      const userData = await authService.login(email, password);
      login(userData);
      navigate(userData.roles.includes('ADMIN') ? '/admin' : '/user');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl font-bold tracking-tight pb-2">
            Welcome to Service Execution Platform
          </CardTitle>
          <p className="text-sm text-gray-500 leading-relaxed">
            Your integrated hub for executing MITC advanced AI service models with support for 
            multiple input and output types.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-900 px-4 py-2 rounded-md text-sm">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="m@example.com"
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10"
            />
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full bg-amber-600 hover:bg-amber-700 h-10 font-medium"
          >
            Sign In
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col items-center pb-6 pt-2">
          <Button
            variant="link"
            className="text-sm text-gray-500 hover:text-gray-700"
            onClick={onContactClick}
          >
            Need access? Contact us
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;