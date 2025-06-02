// components/AIAssistant.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { Patient, PatientVitals } from '@/utils/dummyData';
import { getDoctorSummary } from '@/utils/geminiDoctor'; // ⬅️ Import Gemini API

interface AIAssistantProps {
  patient: Patient;
  vitals: PatientVitals;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ patient, vitals }) => {
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'ai'; timestamp: Date }[]>([
    {
      text: generateInitialMessage(patient, vitals),
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      sender: 'user' as const,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const summary = await getDoctorSummary(input, buildPatientInfo(patient, vitals));
      const aiResponse = {
        text: summary,
        sender: 'ai' as const,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      setMessages(prev => [...prev, {
        text: "Sorry, the AI couldn't process your request.",
        sender: 'ai',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Card className="shadow-md border border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <span>AI Health Assistant</span>
          {isTyping && (
            <span className="text-xs font-normal text-muted-foreground animate-pulse">
              AI is typing...
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-[220px] overflow-y-auto space-y-3 bg-gray-50 dark:bg-gray-900 rounded-md p-3">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-muted/40 text-gray-800 dark:text-gray-100'
                }`}
              >
                {msg.text}
                <div className={`text-xs mt-1 opacity-70 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about patient status..."
            className="flex-1 rounded-md border border-gray-300 dark:border-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 
              bg-white dark:bg-gray-800 p-2 text-sm outline-none dark:text-gray-100"
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function generateInitialMessage(patient: Patient, vitals: PatientVitals): string {
  const name = patient.name.split(' ')[0];
  if (patient.status === 'critical') {
    return `Alert: ${name}'s vital signs indicate critical status. Temperature is ${vitals.temperature.current}°C, oxygen level at ${vitals.oxygenLevel.current}%, and pulse rate is ${vitals.pulse.current}bpm. Immediate medical attention recommended.`;
  } else if (patient.status === 'warning') {
    return `Monitoring notice: ${name} shows elevated vital signs with temperature at ${vitals.temperature.current}°C, oxygen level at ${vitals.oxygenLevel.current}%, and pulse at ${vitals.pulse.current}bpm. Continued monitoring advised.`;
  } else {
    return `${name}'s vitals are stable. Temperature ${vitals.temperature.current}°C, oxygen level ${vitals.oxygenLevel.current}%, and pulse ${vitals.pulse.current}bpm. All parameters within normal ranges.`;
  }
}

function buildPatientInfo(patient: Patient, vitals: PatientVitals): string {
  return `
Name: ${patient.name}
Age: ${patient.age}
Gender: ${patient.gender}
Condition: ${patient.condition || 'N/A'}
Status: ${patient.status}

Vitals:
- Temperature: ${vitals.temperature.current}°C
- Oxygen Level: ${vitals.oxygenLevel.current}%
- Pulse: ${vitals.pulse.current} bpm
  `.trim();
}

export default AIAssistant;
