
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { Patient } from "@/utils/dummyData";
import { Plus, Save, X, Upload, Camera } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PatientRegistrationProps {
  onRegistrationComplete: (newPatient: Patient) => void;
  onCancel: () => void;
}

const PatientRegistration: React.FC<PatientRegistrationProps> = ({ 
  onRegistrationComplete,
  onCancel
}) => {
  const { toast } = useToast();
  const [newPatient, setNewPatient] = useState<Partial<Patient>>({
    name: '',
    age: 0,
    gender: 'Female',
    status: 'normal',
    avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
    additionalInfo: ''
  });
  
  // For photo upload preview
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPatient(prev => ({
      ...prev,
      [name]: name === 'age' ? Number(value) : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewPatient(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        setNewPatient(prev => ({
          ...prev,
          avatar: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!newPatient.name || !newPatient.age || !newPatient.gender) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Generate a unique ID
    const patientId = `pat-${Date.now()}`;
    
    const completePatient = {
      id: patientId,
      ...newPatient
    } as Patient;

    onRegistrationComplete(completePatient);
    
    toast({
      title: "Patient registered",
      description: `${newPatient.name} has been successfully registered.`
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="h-5 w-5 mr-2 text-primary" />
          Register New Patient
        </CardTitle>
        <CardDescription>Add a new patient to the healthcare system</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo Upload Section */}
          <div className="flex justify-center mb-6">
            <div className="flex flex-col items-center">
              <Avatar className="w-24 h-24 border-2 border-primary/20">
                <AvatarImage src={avatarPreview || newPatient.avatar} alt="Patient photo" />
                <AvatarFallback>
                  {newPatient.name ? newPatient.name.slice(0, 2).toUpperCase() : 'PT'}
                </AvatarFallback>
              </Avatar>
              <Label 
                htmlFor="photo-upload" 
                className="mt-2 flex items-center gap-1 text-sm cursor-pointer text-primary hover:underline"
              >
                <Camera className="h-4 w-4" />
                Upload Photo
              </Label>
              <Input 
                id="photo-upload" 
                type="file" 
                accept="image/*"
                className="hidden" 
                onChange={handlePhotoChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
              <Input 
                id="name" 
                name="name" 
                value={newPatient.name || ''} 
                onChange={handleInputChange}
                required
                className="transition-all focus-visible:ring-primary"
              />
            </div>
            <div>
              <Label htmlFor="age">Age <span className="text-red-500">*</span></Label>
              <Input 
                id="age" 
                name="age" 
                type="number" 
                min="0"
                max="150"
                value={newPatient.age || ''} 
                onChange={handleInputChange}
                required
                className="transition-all focus-visible:ring-primary"
              />
            </div>
            <div>
              <Label htmlFor="gender">Gender <span className="text-red-500">*</span></Label>
              <Select 
                name="gender" 
                onValueChange={(value) => handleSelectChange("gender", value)}
                defaultValue={newPatient.gender}
                required
              >
                <SelectTrigger className="transition-all focus-visible:ring-primary">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="room">Room</Label>
              <Input 
                id="room" 
                name="room"
                value={newPatient.room || ''} 
                onChange={handleInputChange}
                className="transition-all focus-visible:ring-primary"
              />
            </div>
            <div>
              <Label htmlFor="condition">Medical Condition</Label>
              <Input 
                id="condition" 
                name="condition"
                value={newPatient.condition || ''} 
                onChange={handleInputChange}
                className="transition-all focus-visible:ring-primary"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                name="status" 
                onValueChange={(value) => handleSelectChange("status", value)}
                defaultValue={newPatient.status}
              >
                <SelectTrigger className="transition-all focus-visible:ring-primary">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="additionalInfo">Additional Information</Label>
            <Textarea 
              id="additionalInfo" 
              name="additionalInfo"
              value={newPatient.additionalInfo || ''} 
              onChange={handleInputChange}
              rows={3}
              className="resize-none transition-all focus-visible:ring-primary"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" />
              Register Patient
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PatientRegistration;
