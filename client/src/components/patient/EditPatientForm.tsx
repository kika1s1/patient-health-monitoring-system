
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Patient } from "@/utils/dummyData";

interface EditPatientFormProps {
  editedPatient: Patient;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const EditPatientForm: React.FC<EditPatientFormProps> = ({ editedPatient, handleInputChange }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            name="name" 
            value={editedPatient.name} 
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="age">Age</Label>
          <Input 
            id="age" 
            name="age" 
            type="number" 
            value={editedPatient.age} 
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Input 
            id="gender" 
            name="gender" 
            value={editedPatient.gender} 
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="room">Room</Label>
          <Input 
            id="room" 
            name="room"
            value={editedPatient.room || ''} 
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="condition">Medical Condition</Label>
          <Input 
            id="condition" 
            name="condition"
            value={editedPatient.condition || ''} 
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="additionalInfo">Additional Information</Label>
        <Textarea 
          id="additionalInfo" 
          name="additionalInfo"
          value={editedPatient.additionalInfo || ''} 
          onChange={handleInputChange}
          rows={4}
        />
      </div>
    </div>
  );
};

export default EditPatientForm;
