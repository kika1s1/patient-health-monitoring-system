
import React, { useState } from 'react';
import Header from '@/components/Header';
import DashboardFooter from '@/components/layout/DashboardFooter';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, PhoneCall } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import PatientChat from '../components/messaging/PatientChat';
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/use-toast';

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  online: boolean;
  age?: number;
  gender?: string;
  status?: 'normal' | 'warning' | 'critical';
}

const dummyContacts: Contact[] = [
  {
    id: "doc-1",
    name: "Dr. Sarah Johnson",
    role: "Neurologist",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    lastMessage: "How are you feeling today?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 15),
    unreadCount: 1,
    online: true,
    age: 38,
    gender: "Female"
  },
  {
    id: "doc-2",
    name: "Dr. Michael Lee",
    role: "Cardiologist",
    avatar: "https://randomuser.me/api/portraits/men/42.jpg",
    lastMessage: "Your ECG results look good",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 3),
    unreadCount: 0,
    online: true,
    age: 45,
    gender: "Male"
  },
  {
    id: "pat-1",
    name: "Emma Wilson",
    role: "Patient",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    lastMessage: "When is my next appointment?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 8),
    unreadCount: 2,
    online: false,
    age: 29,
    gender: "Female"
  },
  {
    id: "pat-2",
    name: "James Rodriguez",
    role: "Patient",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    lastMessage: "Thank you for the prescription",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 48),
    unreadCount: 0,
    online: true,
    age: 35,
    gender: "Male"
  },
  {
    id: "pat-3",
    name: "David Wang",
    role: "Patient",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    lastMessage: "I'll send my latest test results",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 72),
    unreadCount: 0,
    online: false,
    age: 42,
    gender: "Male"
  }
];

const formatMessageTime = (date: Date) => {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 24 && date.getDate() === now.getDate()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffInHours < 48) {
    return `Yesterday`;
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

const Messages: React.FC = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  const filteredContacts = dummyContacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    setIsChatOpen(true);
  };

  const handleCallContact = (contact: Contact) => {
    toast({
      title: "Calling...",
      description: `Initiating call with ${contact.name}`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Messages</h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search contacts..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <ScrollArea className="h-[calc(80vh-230px)]">
              <div className="p-2">
                {filteredContacts.map((contact) => (
                  <div 
                    key={contact.id}
                    className="p-3 rounded-md mb-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center">
                      <div 
                        className="relative cursor-pointer" 
                        onClick={() => handleContactSelect(contact)}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={contact.avatar} alt={contact.name} />
                          <AvatarFallback>{contact.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        {contact.online && (
                          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
                        )}
                      </div>
                      <div 
                        className="ml-3 flex-1 overflow-hidden cursor-pointer"
                        onClick={() => handleContactSelect(contact)}
                      >
                        <div className="flex justify-between">
                          <p className="font-medium text-sm truncate">{contact.name}</p>
                          {contact.lastMessageTime && (
                            <span className="text-xs text-gray-500">
                              {formatMessageTime(contact.lastMessageTime)}
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-gray-500 truncate">
                            {contact.role}
                          </p>
                          {contact.unreadCount > 0 && (
                            <div className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                              {contact.unreadCount}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="ml-2"
                        onClick={() => handleCallContact(contact)}
                      >
                        <PhoneCall className="h-4 w-4 text-primary" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </main>
      
      <DashboardFooter />
      
      {/* Chat Sheet */}
      {selectedContact && (
        <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
          <SheetContent className="sm:max-w-[450px] p-0" side="right">
            <PatientChat 
              patient={{
                id: selectedContact.id,
                name: selectedContact.name,
                gender: (selectedContact.gender as 'Male' | 'Female' | 'Other') || 'Other',
                age: selectedContact.age || 0,
                status: selectedContact.status || 'normal',
                avatar: selectedContact.avatar,
                location: {
                  address: '',
                  city: '',
                  state: '',
                  zipCode: '',
                  coordinates: { lat: 0, lng: 0 },
                  inHospital: false
                }
              }}
              onClose={() => setIsChatOpen(false)}
            />
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default Messages;
