import React, { useState } from 'react';
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
import { Textarea } from '@/Components/ui/textarea';
import axiosInstance from '@/utils/axios';

interface ContactFormProps {
  onBackClick: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onBackClick }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        requestType: 'CONTACT',
        status: 'pending'
      };

      await axiosInstance.post('/account-requests', payload);
      alert('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error: any) {
      console.error('Error submitting the form:', error);
      if (error.response?.status === 401) {
        alert('Please login to send a message.');
      } else if (error.response?.status === 400) {
        alert('Please fill in all required fields correctly.');
      } else {
        alert('Failed to send message. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Contact Us</CardTitle>
          <p className="text-sm text-muted-foreground">
            Send us a message and we'll get back to you.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Type your message here"
              value={formData.message}
              onChange={handleChange}
            />
          </div>
          <Button
            className="w-full bg-amber-600 hover:bg-amber-700"
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.email || !formData.name || !formData.message}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            className="text-sm text-muted-foreground"
            onClick={onBackClick}
          >
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ContactForm;
