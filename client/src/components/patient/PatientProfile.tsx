import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Patient } from "@/utils/types";
import { Edit2, MessageSquare, Save, X } from "lucide-react";
import PatientBasicInfo from './PatientBasicInfo';
import PatientMedicalInfo from './PatientMedicalInfo';
import PatientVisits from './PatientVisits';
import EditPatientForm from './EditPatientForm';

interface PatientProfileProps {
  patient: Patient;
  onPatientUpdate: (updatedPatient: Patient) => void;
  onStartConversation: (patientId?: string) => void;
}

const PatientProfile: React.FC<PatientProfileProps> = ({ patient, onPatientUpdate, onStartConversation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPatient, setEditedPatient] = useState<Patient>({ ...patient });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedPatient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    onPatientUpdate(editedPatient);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedPatient({ ...patient });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">{patient.name}</CardTitle>
              <CardDescription>
                Patient ID: {patient.id}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onStartConversation()}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Message
              </Button>
              {!isEditing ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={handleSave}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCancel}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <PatientBasicInfo patient={patient} />
                <PatientMedicalInfo patient={patient} />
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Additional Information</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {patient.additionalInfo || "No additional information available."}
                </p>

                <PatientVisits patient={patient} />
              </div>
            </div>
          ) : (
            <EditPatientForm 
              editedPatient={editedPatient} 
              handleInputChange={handleInputChange} 
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientProfile;
