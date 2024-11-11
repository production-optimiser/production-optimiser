import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/Components/ui/card';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Textarea } from '@/Components/ui/textarea';


const ContactForm = ({ onBackClick }) => {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Contact us</CardTitle>
          <p className="text-sm text-muted-foreground">
            Interested in joining? Send us an email, and we'll reach out with an invitation to explore the app.
            <br />
            We're excited to have you on board!
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Your email</Label>
            <Input 
              id="email"
              type="email" 
              placeholder="m@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea 
              id="message"
              placeholder="Type your message here."
              className="min-h-[120px] resize-none"
            />
          </div>
          <Button className="w-full bg-amber-600 hover:bg-amber-700">
            Request Invitation
          </Button>
          <Button 
            variant="ghost" 
            className="w-full text-muted-foreground hover:text-foreground"
            onClick={onBackClick}
          >
            Back
          </Button>
        </CardContent>
      </Card>
    );
  };

  export default ContactForm;