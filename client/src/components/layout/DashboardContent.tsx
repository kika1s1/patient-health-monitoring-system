
import React, { useState } from 'react';
import PatientInfo from '@/components/PatientInfo';
import HealthMetricsGrid from '@/components/HealthMetricsGrid';
import PatientList from '@/components/PatientList';
import PatientSearch from '@/components/PatientSearch';
import AIAssistant from '@/components/AIAssistant';
import ECGChart from '@/components/charts/ECGChart';
import CombinedVitalsChart from '@/components/charts/CombinedVitalsChart';
import PatientDialog from '@/components/patient/PatientDialog';
import { Patient, PatientVitals } from '@/utils/types';
import { Button } from '@/components/ui/button';
import { MessageSquare, Plus, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface DashboardContentProps {
  patients: Patient[];
  selectedPatientId: string;
  selectedPatient: Patient;
  selectedVitals: PatientVitals;
  onSelectPatient: (id: string) => void;
  onUpdatePatient: (updatedPatient: Patient) => void;
  onAddPatient: (newPatient: Patient) => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  patients,
  selectedPatientId,
  selectedPatient,
  selectedVitals,
  onSelectPatient,
  onUpdatePatient,
  onAddPatient
}) => {
  const { toast } = useToast();
  const [isPatientDialogOpen, setIsPatientDialogOpen] = useState(false);
  const [isRegistrationDialogOpen, setIsRegistrationDialogOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const openPatientProfile = () => {
    setIsPatientDialogOpen(true);
    setIsChatOpen(false);
  };

  const openPatientRegistration = () => {
    setIsRegistrationDialogOpen(true);
  };

  const startConversation = () => {
    setIsChatOpen(true);
    setIsPatientDialogOpen(false);
  };

  return (
    <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <PatientSearch patients={patients} onSelectPatient={onSelectPatient} />
          <Button onClick={openPatientRegistration} className="transition-all hover:shadow-md">
            <Plus className="mr-2 h-4 w-4" />
            Register New Patient
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Patient List */}
          <div className="lg:col-span-1 space-y-6">
            <PatientList
              patients={patients}
              selectedPatientId={selectedPatientId}
              onSelectPatient={onSelectPatient}
            />
            
            <AIAssistant patient={selectedPatient} vitals={selectedVitals} />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Patient Info with Actions */}
            <div className="flex justify-between items-start">
              <PatientInfo patient={selectedPatient} />
              <div className="flex gap-2 ml-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={openPatientProfile}
                  className="transition-all hover:bg-primary/10"
                >
                  <User className="mr-2 h-4 w-4" />
                  View Profile
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={startConversation}
                  className="transition-all hover:bg-primary/10"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message
                </Button>
              </div>
            </div>
            
            {/* Health Metrics Grid */}
            <HealthMetricsGrid vitals={selectedVitals} />
            
            {/* Full ECG Chart */}
            <ECGChart ecgData={selectedVitals.ecg.history} />
            
            {/* Combined Vitals Trend */}
            <CombinedVitalsChart vitals={selectedVitals} />
          </div>
        </div>
      </div>

      {/* Patient Profile Dialog */}
      {isPatientDialogOpen && (
        <PatientDialog
          isOpen={isPatientDialogOpen}
          onClose={() => setIsPatientDialogOpen(false)}
          patient={selectedPatient}
          patients={patients}
          onPatientUpdate={onUpdatePatient}
          onPatientCreate={onAddPatient}
          onStartConversation={startConversation}
          initialTab="profile"
        />
      )}

      {/* Patient Chat Dialog */}
      {isChatOpen && (
        <PatientDialog
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          patient={selectedPatient}
          patients={patients}
          onPatientUpdate={onUpdatePatient}
          onPatientCreate={onAddPatient}
          onStartConversation={startConversation}
          initialTab="messages"
        />
      )}

      {/* Patient Registration Dialog */}
      {isRegistrationDialogOpen && (
        <PatientDialog
          isOpen={isRegistrationDialogOpen}
          onClose={() => setIsRegistrationDialogOpen(false)}
          patients={patients}
          onPatientUpdate={onUpdatePatient}
          onPatientCreate={onAddPatient}
          onStartConversation={startConversation}
        />
      )}
    </div>
  );
};

export default DashboardContent;
