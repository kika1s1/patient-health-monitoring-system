
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, ArrowLeft, PhoneCall } from "lucide-react";
import { Patient } from '@/utils/types';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isPatient: boolean;
}

interface PatientChatProps {
  onClose: () => void;
  patient?: Patient;
}

const formatMessageTime = (date: Date) => {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 24 && date.getDate() === now.getDate()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffInHours < 48) {
    return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + 
           date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
};

const PatientChat: React.FC<PatientChatProps> = ({ patient, onClose }) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  
  useEffect(() => {
    if (patient) {
      // Generate initial welcome message
      const initialMessage: Message = {
        id: `msg-welcome`,
        senderId: "system",
        content: "Welcome to the chat. How can I help you today?",
        timestamp: new Date(),
        isPatient: false
      };
      
      setMessages([initialMessage]);
    }
  }, [patient]);
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: "doctor",
      content: newMessage,
      timestamp: new Date(),
      isPatient: false
    };
    
    setMessages(prev => [...prev, newMsg]);
    setNewMessage("");
    
    // Simulate patient response after a delay
    setTimeout(() => {
      const responses = [
        "Thank you for the information, doctor.",
        "I understand, that makes sense.",
        "I'll follow your advice and let you know how it goes.",
        "When should I schedule my next appointment?",
        "Is there anything else I should be aware of?"
      ];
      
      const patientResponse: Message = {
        id: `msg-${Date.now() + 1}`,
        senderId: patient?.id || "patient",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        isPatient: true
      };
      
      setMessages(prev => [...prev, patientResponse]);
    }, 2000);
  };

  const handleCall = () => {
    toast({
      title: "Starting call",
      description: `Initiating call with ${patient?.name || "patient"}`,
    });
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onClose} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarImage src={patient?.avatar} alt={patient?.name || "Patient"} />
            <AvatarFallback>{patient?.name?.slice(0, 2) || "PT"}</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="font-medium">{patient?.name || "Patient"}</p>
            {patient && (
              <p className="text-xs text-muted-foreground">
                {patient.age} years • {patient.gender}
              </p>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={handleCall}>
          <PhoneCall className="h-4 w-4 text-primary" />
        </Button>
      </div>
      
      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.isPatient ? "justify-start" : "justify-end"}`}
            >
              <div 
                className={`max-w-[75%] rounded-lg p-3 ${
                  message.isPatient 
                    ? "bg-muted" 
                    : "bg-primary text-primary-foreground"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {formatMessageTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      {/* Message input */}
      <div className="border-t border-border p-4">
        <div className="flex space-x-2">
          <Input 
            placeholder="Type your message..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!newMessage.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientChat;
