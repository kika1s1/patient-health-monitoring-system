
import React from 'react';
import { Patient } from "@/data/types";
import { Badge } from "@/components/ui/badge";
import { MapPin, Home, Hospital } from "lucide-react";
import PatientLocationMap from "./PatientLocationMap";

interface PatientMedicalInfoProps {
  patient: Patient;
}

const PatientMedicalInfo: React.FC<PatientMedicalInfoProps> = ({ patient }) => {
  // Use patient.location if it exists, otherwise create mock data
  const patientLocation = patient.location || {
    address: "123 Health St",
    city: "Medical City",
    state: "Wellness",
    zipCode: "12345",
    coordinates: { lat: 37.7749, lng: -122.4194 },
    inHospital: Math.random() > 0.5 // Randomly determine if patient is in hospital for demo
  };

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-md p-4 shadow-sm border border-border/50">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">Medical Information</h4>
        {patient.condition ? (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-100">
            {patient.condition}
          </Badge>
        ) : (
          <p className="text-sm text-muted-foreground italic">No conditions recorded</p>
        )}
      </div>
      
      <div className="bg-card rounded-md p-4 shadow-sm border border-border/50">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">Status</h4>
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-2 ${
            patient.status === 'normal' ? 'bg-green-500' : 
            patient.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          <p className="font-medium capitalize">{patient.status}</p>
        </div>
      </div>
      
      <div className="bg-card rounded-md p-4 shadow-sm border border-border/50">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">Location</h4>
        <div className="flex items-center">
          {patientLocation.inHospital ? 
            <Hospital className="h-4 w-4 text-muted-foreground mr-2" /> :
            <Home className="h-4 w-4 text-muted-foreground mr-2" />
          }
          <div>
            <p className="text-sm font-medium">
              {patientLocation.inHospital ? 
                (patient.room ? `Room ${patient.room}` : 'In Hospital (No Room Assigned)') : 
                'At Home'
              }
            </p>
            <p className="text-xs text-muted-foreground">
              {patientLocation.address}, {patientLocation.city}, {patientLocation.state} {patientLocation.zipCode}
            </p>
          </div>
        </div>
      </div>
      
      {/* Patient GPS Location Map */}
      <div className="bg-card rounded-md p-4 shadow-sm border border-border/50">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">GPS Location</h4>
        <div className="flex items-center mb-2">
          <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
          <p className="text-sm">
            Coordinates: {patientLocation.coordinates.lat.toFixed(6)}, {patientLocation.coordinates.lng.toFixed(6)}
          </p>
        </div>
        <div className="h-64 w-full mt-2">
          <PatientLocationMap 
            coordinates={patientLocation.coordinates} 
            className="h-full w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default PatientMedicalInfo;
