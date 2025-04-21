
import React from 'react';
import { Patient } from "@/data/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Home, Hospital, MapPin } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface PatientBasicInfoProps {
  patient: Patient;
}

const PatientBasicInfo: React.FC<PatientBasicInfoProps> = ({ patient }) => {
  const isInHospital = patient.location?.inHospital;

  return (
    <Card className="p-4 shadow-sm border border-border/50 mb-4">
      <div className="flex items-center">
        <Avatar className="h-20 w-20 border-2 border-primary/20">
          <AvatarImage 
            src={patient.avatar} 
            alt={patient.name}
            className="object-cover"
          />
          <AvatarFallback>{patient.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="ml-4">
          <p className="text-lg font-medium">{patient.name}</p>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>{patient.age} years</span>
            <span className="mx-2">•</span>
            <span>{patient.gender}</span>
          </div>
          <div className="flex items-center mt-1 text-sm">
            {isInHospital ? (
              <>
                <Hospital className="h-3.5 w-3.5 text-primary mr-1.5" />
                <span className="text-primary font-medium">
                  {patient.room ? `Room: ${patient.room}` : 'In Hospital'}
                </span>
              </>
            ) : (
              <>
                <Home className="h-3.5 w-3.5 text-amber-500 mr-1.5" />
                <span className="text-amber-500 font-medium">
                  {patient.location?.city}, {patient.location?.state}
                </span>
              </>
            )}
          </div>
          {patient.location && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center mt-1 text-xs text-muted-foreground cursor-help">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>
                    {patient.location.coordinates.lat.toFixed(4)}, {patient.location.coordinates.lng.toFixed(4)}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>GPS Location</p>
              </TooltipContent>
            </Tooltip>
          )}
          {patient.condition && (
            <p className="mt-1 text-sm font-medium text-amber-500">
              {patient.condition}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default PatientBasicInfo;
