
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Patient } from '@/utils/types';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import PatientProfile from './PatientProfile';
import PatientRegistration from './PatientRegistration';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import PatientChat from '../messaging/PatientChat';

interface PatientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patient?: Patient;
  patients: Patient[];
  onPatientUpdate: (updatedPatient: Patient) => void;
  onPatientCreate: (newPatient: Patient) => void;
  onStartConversation: (patientId?: string) => void;
  initialTab?: 'profile' | 'register' | 'messages';
}

const PatientDialog: React.FC<PatientDialogProps> = ({
  isOpen,
  onClose,
  patient,
  patients,
  onPatientUpdate,
  onPatientCreate,
  onStartConversation,
  initialTab
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>(initialTab || (patient ? 'profile' : 'register'));
  const [isChatOpen, setIsChatOpen] = useState(initialTab === 'messages');

  useEffect(() => {
    // When initial tab changes, update the activeTab and chatOpen state
    setActiveTab(initialTab || (patient ? 'profile' : 'register'));
    setIsChatOpen(initialTab === 'messages');
  }, [initialTab, patient]);

  const handlePatientUpdate = (updatedPatient: Patient) => {
    onPatientUpdate(updatedPatient);
    toast({
      title: "Patient updated",
      description: `${updatedPatient.name}'s information has been updated successfully.`
    });
  };

  const handleRegistrationComplete = (newPatient: Patient) => {
    onPatientCreate(newPatient);
    onClose();
  };
  
  const handleOpenChat = () => {
    if (patient) {
      setIsChatOpen(true);
      onStartConversation();
    }
  };

  // If the initialTab is "messages", render the chat instead of profile content
  if (activeTab === 'messages' && patient) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="sm:max-w-[450px] p-0" side="right">
          <PatientChat 
            patient={patient}
            onClose={onClose}
          />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] h-[80vh] overflow-hidden flex flex-col max-h-screen">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>
            {patient ? `Patient: ${patient.name}` : 'Register New Patient'}
          </DialogTitle>
          {patient && activeTab === 'profile' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleOpenChat}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
          )}
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          {patient ? (
            <PatientProfile 
              patient={patient}
              onPatientUpdate={handlePatientUpdate}
              onStartConversation={onStartConversation}
            />
          ) : (
            <PatientRegistration 
              onRegistrationComplete={handleRegistrationComplete}
              onCancel={onClose}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientDialog;
