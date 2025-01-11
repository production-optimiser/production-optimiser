import { useEffect, useState } from 'react';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import { ChevronDown, Copy, Plus } from 'lucide-react';
import { UserProfile } from '../Components/UserProfile/index.tsx';
import { User } from '@/types/auth';
import { authService } from '@/services/auth';
import { useNavigate } from 'react-router-dom';
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import axiosInstance from "../utils/axios"

interface Model {
 id: string;
 name: string;
 version: string;
 inputType: string;
}

interface OptimizationItem {
 id: string;
 title: string;
 isDisabled?: boolean;
}

interface TimeSection {
 id: string;
 title: string;
 items: OptimizationItem[];
}

interface SidebarNavProps {
 modelName?: string;
 modelVersion?: string;
 sections?: TimeSection[];
 onItemClick?: (id: string) => void;
 onNewChat?: () => void;
 availableModels?: Model[];
 selectedModel?: Model | null;
 onModelSelect?: (model: Model) => void;
}

const generateId = (prefix: string, value: string) =>
 `${prefix}-${value.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

const defaultSections: TimeSection[] = [
 {
   id: 'today-section',
   title: 'Today',
   items: [
     {
       id: generateId('opt', 'Candy Optimization'),
       title: 'Candy Optimization',
     },
     {
       id: generateId('opt', 'Plane engine optimization'),
       title: 'Plane engine optimization',
     },
   ],
 },
 {
   id: 'last-7-days',
   title: 'Last 7 days',
   items: Array(10)
     .fill(null)
     .map((_, index) => ({
       id: generateId('opt', `Test optimization ${index}`),
       title: 'Test optimization',
     })),
 },
 {
   id: 'last-30-days',
   title: 'Last 30 days',
   items: Array(5)
     .fill(null)
     .map((_, index) => ({
       id: generateId('opt', `Older optimization ${index}`),
       title: 'Older optimization',
       isDisabled: true,
     })),
 },
];

const SidebarNav = ({
 modelName = 'Request Model Access From Admin',
 modelVersion = 'v3.4.2',
 sections = defaultSections,
 onItemClick,
 onNewChat,
 availableModels = [],
 selectedModel,
 onModelSelect,
}: SidebarNavProps) => {
 const [currentUser, setCurrentUser] = useState<User | null>(null);
 const [selectedItem, setSelectedItem] = useState<string | null>(null);
 const [isDropdownOpen, setIsDropdownOpen] = useState(false);
 
 
 const navigate = useNavigate();

 useEffect(() => {
   const user = authService.getCurrentUser();
   if (user) {
     setCurrentUser(user);
   }
 }, []);



 const handleItemClick = (id: string) => {
   setSelectedItem(id);
   onItemClick?.(id);
 };

 const handleModelSelect = (model: Model) => {
   onModelSelect?.(model);
   setIsDropdownOpen(false);
 };

 const handleLogout = () => {
   authService.logout();
   navigate('/login');
 };

 const displayModelName = selectedModel 
   ? `${selectedModel.name} - ${selectedModel.inputType}`
   : `${modelName}`

 return (
   <Card className="w-64 h-screen flex flex-col">
     <div className="p-4 border-b">
       <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
         <DropdownMenuTrigger asChild>
           <Button
             variant="ghost"
             className="w-full justify-between"
           >
             <div className="flex items-center gap-2 min-w-0">
               <div className="flex-shrink-0 w-8 h-8 bg-orange-200 rounded flex items-center justify-center">
                 <Copy className="w-4 h-4" aria-hidden="true" />
               </div>
               {displayModelName==='Request Model Access From Admin' ? <span className="text-sm font-medium whitespace-normal break-words block max-w-[100px] overflow-hidden" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3, // Up to 2 lines
                    WebkitBoxOrient: 'vertical',
                  }}>
                 {displayModelName}
               </span> : <span className="text-sm font-medium truncate overflow-hidden">
                 {displayModelName}
               </span>}
               
             </div>
             <ChevronDown className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
           </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent className="w-56">
           {availableModels.map((model) => (
             <DropdownMenuItem
               key={model.id}
               onClick={() => handleModelSelect(model)}
               className="cursor-pointer"
             >
               <span>{model.name} - {model.inputType}</span>
             </DropdownMenuItem>
           ))}
         </DropdownMenuContent>
       </DropdownMenu>
     </div>

     <div className="p-4 border-b">
       <Button 
         variant="outline" 
         className="w-full flex items-center gap-2"
         onClick={onNewChat}
       >
         <Plus className="w-4 h-4" />
         <span>New Chat</span>
       </Button>
     </div>

     <ScrollArea className="flex-1">
       <nav aria-label="Optimization history" className="p-4">
         <div className="space-y-4">
           {sections.map((section) => (
             <div key={section.id}>
               <h2 className="text-sm text-gray-500 mb-2">{section.title}</h2>
               <div className="space-y-1">
                 {section.items.map((item) => (
                   <Button
                     key={item.id}
                     variant="ghost"
                     className={`w-full justify-start text-sm whitespace-normal text-left h-auto py-2 ${
                       selectedItem === item.id ? 'bg-gray-100' : ''
                     } ${item.isDisabled ? 'text-gray-500' : ''}`}
                     disabled={item.isDisabled}
                     onClick={() => handleItemClick(item.id)}
                   >
                     {item.title}
                   </Button>
                 ))}
               </div>
             </div>
           ))}
         </div>
       </nav>
     </ScrollArea>

     <div className="border-t p-4">
       <UserProfile 
         name={currentUser?.email?.split('@')[0] || 'User'} 
         email={currentUser?.email || ''} 
         role={currentUser?.roles?.[0] ?? 'customer'}
         onLogout={handleLogout}
         
       />
     </div>
   </Card>
 );
};

export default SidebarNav;
