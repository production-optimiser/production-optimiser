import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-red-500">
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You don't have permission to access this page.
          </p>
          <Button
            onClick={() => navigate(-1)}
            className="w-full bg-amber-600 hover:bg-amber-700"
          >
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnauthorizedPage;