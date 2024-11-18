import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";

interface UserProfileProps {
  name: string;
  email: string;
  imageUrl?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ name, email, imageUrl }) => {
  return (
    <div className="flex items-center gap-3 p-4 hover:bg-gray-100 rounded-lg cursor-pointer">
      <Avatar>
        <AvatarImage src={imageUrl} alt={name} />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
      <div>
        <h3 className="text-sm font-medium">{name}</h3>
        <p className="text-xs text-gray-500">{email}</p>
      </div>
    </div>
  );
};
