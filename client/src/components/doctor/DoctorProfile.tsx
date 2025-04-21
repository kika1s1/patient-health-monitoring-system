
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Edit2, Save, X } from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  email: string;
  role: string;
  specialty: string;
  department: string;
  avatar: string;
  age: number;
  bio: string;
  experience: number;
  education: string;
}

interface DoctorProfileProps {
  doctor: Doctor;
  onDoctorUpdate: (updatedDoctor: Doctor) => void;
}

const DoctorProfile: React.FC<DoctorProfileProps> = ({ doctor, onDoctorUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDoctor, setEditedDoctor] = useState<Doctor>({ ...doctor });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedDoctor(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'experience' ? Number(value) : value
    }));
  };

  const handleSave = () => {
    onDoctorUpdate(editedDoctor);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedDoctor({ ...doctor });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl font-bold">Doctor Profile</CardTitle>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profile
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
                <div className="flex items-center mb-6">
                  <img 
                    src={doctor.avatar} 
                    alt={doctor.name} 
                    className="w-24 h-24 rounded-full border-2 border-white shadow-lg"
                  />
                  <div className="ml-6">
                    <p className="text-lg font-medium">{doctor.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {doctor.role} • {doctor.specialty}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {doctor.department} Department
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                    <p className="font-medium">{doctor.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Age</h4>
                    <p className="font-medium">{doctor.age} years</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Experience</h4>
                    <p className="font-medium">{doctor.experience} years</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Education</h4>
                    <p className="font-medium">{doctor.education}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">About Me</h3>
                <p className="text-sm">{doctor.bio}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={editedDoctor.name} 
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="specialty">Specialty</Label>
                  <Input 
                    id="specialty" 
                    name="specialty" 
                    value={editedDoctor.specialty} 
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input 
                    id="department" 
                    name="department" 
                    value={editedDoctor.department} 
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input 
                    id="age" 
                    name="age" 
                    type="number" 
                    value={editedDoctor.age} 
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input 
                    id="experience" 
                    name="experience" 
                    type="number" 
                    value={editedDoctor.experience} 
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="education">Education</Label>
                  <Input 
                    id="education" 
                    name="education" 
                    value={editedDoctor.education} 
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="bio">About Me/Biography</Label>
                <Textarea 
                  id="bio" 
                  name="bio" 
                  value={editedDoctor.bio} 
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorProfile;
