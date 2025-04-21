
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { Patient, PatientVitals } from '@/utils/dummyData';

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

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = {
      text: input,
      sender: 'user' as const,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate AI thinking and responding
    setTimeout(() => {
      const aiResponse = {
        text: generateAIResponse(input, patient, vitals),
        sender: 'ai' as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <Card className="shadow-md">
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
                className={`
                  max-w-[85%] rounded-lg px-3 py-2 text-sm
                  ${msg.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                  }
                `}
              >
                {msg.text}
                <div 
                  className={`
                    text-xs mt-1 opacity-70
                    ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}
                  `}
                >
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
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
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

function generateAIResponse(userMessage: string, patient: Patient, vitals: PatientVitals): string {
  const lowercaseMessage = userMessage.toLowerCase();
  const name = patient.name.split(' ')[0];
  
  // Check for temperature related questions
  if (lowercaseMessage.includes('temperature') || lowercaseMessage.includes('fever')) {
    const temperatureTrend = vitals.temperature.history.length > 1 ? 
      (vitals.temperature.history[vitals.temperature.history.length - 1].value > 
       vitals.temperature.history[0].value ? 'increasing' : 'decreasing') : 'stable';
    
    if (vitals.temperature.current > 38) {
      return `${name}'s temperature is elevated at ${vitals.temperature.current}°C and has been ${temperatureTrend} over the last 24 hours. This is above the normal range and should be monitored closely.`;
    } else if (vitals.temperature.current < 36) {
      return `${name}'s temperature is below normal at ${vitals.temperature.current}°C and has been ${temperatureTrend} over the last 24 hours. This is below the normal range and should be monitored.`;
    } else {
      return `${name}'s temperature is normal at ${vitals.temperature.current}°C and has been ${temperatureTrend} over the last 24 hours, staying within the normal range of 36.5-37.5°C.`;
    }
  }
  
  // Check for oxygen level related questions
  else if (lowercaseMessage.includes('oxygen') || lowercaseMessage.includes('o2') || lowercaseMessage.includes('breathing')) {
    const oxygenTrend = vitals.oxygenLevel.history.length > 1 ? 
      (vitals.oxygenLevel.history[vitals.oxygenLevel.history.length - 1].value > 
       vitals.oxygenLevel.history[0].value ? 'increasing' : 'decreasing') : 'stable';
    
    if (vitals.oxygenLevel.current < 90) {
      return `${name}'s oxygen level is critically low at ${vitals.oxygenLevel.current}% and has been ${oxygenTrend} over the last 24 hours. Medical intervention may be required.`;
    } else if (vitals.oxygenLevel.current < 95) {
      return `${name}'s oxygen level is below optimal at ${vitals.oxygenLevel.current}% and has been ${oxygenTrend} over the last 24 hours. Continue monitoring and consider supplemental oxygen if it drops further.`;
    } else {
      return `${name}'s oxygen level is good at ${vitals.oxygenLevel.current}% and has been ${oxygenTrend} over the last 24 hours, which is within the normal range of 95-100%.`;
    }
  }
  
  // Check for pulse/heart rate related questions
  else if (lowercaseMessage.includes('pulse') || lowercaseMessage.includes('heart') || lowercaseMessage.includes('bpm')) {
    const pulseTrend = vitals.pulse.history.length > 1 ? 
      (vitals.pulse.history[vitals.pulse.history.length - 1].value > 
       vitals.pulse.history[0].value ? 'increasing' : 'decreasing') : 'stable';
    
    if (vitals.pulse.current > 100) {
      return `${name}'s pulse rate is elevated at ${vitals.pulse.current} bpm and has been ${pulseTrend} over the last 24 hours. This indicates tachycardia and should be monitored.`;
    } else if (vitals.pulse.current < 60) {
      return `${name}'s pulse rate is low at ${vitals.pulse.current} bpm and has been ${pulseTrend} over the last 24 hours. This indicates bradycardia and should be evaluated.`;
    } else {
      return `${name}'s pulse rate is normal at ${vitals.pulse.current} bpm and has been ${pulseTrend} over the last 24 hours, which is within the normal range of 60-100 bpm.`;
    }
  }
  
  // Check for condition related questions
  else if (lowercaseMessage.includes('condition') || lowercaseMessage.includes('diagnosis') || lowercaseMessage.includes('what') || lowercaseMessage.includes('wrong')) {
    if (patient.condition) {
      return `${name} is currently being treated for ${patient.condition}. Their vital signs are being monitored ${patient.status === 'critical' ? 'very closely' : 'regularly'}.`;
    } else {
      return `${name} is currently under general monitoring. No specific condition has been diagnosed yet, but all vital signs are being tracked regularly.`;
    }
  }
  
  // General questions about status
  else if (lowercaseMessage.includes('status') || lowercaseMessage.includes('how') || lowercaseMessage.includes('vitals')) {
    if (patient.status === 'critical') {
      return `${name} is currently in critical condition. Temperature is ${vitals.temperature.current}°C, oxygen level is ${vitals.oxygenLevel.current}%, and pulse rate is ${vitals.pulse.current}bpm. The medical team has been alerted.`;
    } else if (patient.status === 'warning') {
      return `${name} is currently under caution status. Temperature is ${vitals.temperature.current}°C, oxygen level is ${vitals.oxygenLevel.current}%, and pulse rate is ${vitals.pulse.current}bpm. We're monitoring these parameters closely.`;
    } else {
      return `${name} is in stable condition. Temperature is ${vitals.temperature.current}°C, oxygen level is ${vitals.oxygenLevel.current}%, and pulse rate is ${vitals.pulse.current}bpm. All vital signs are within normal ranges.`;
    }
  }
  
  // Default response
  else {
    return `I'm here to help monitor ${name}'s health status. If you have specific questions about their temperature, oxygen levels, pulse rate, or general condition, please let me know.`;
  }
}

export default AIAssistant;
