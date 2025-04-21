
import React from 'react';
import { Patient } from '@/data/types';
import { getStatusColor, getStatusText } from '@/data/dataGenerators';
import { Home, Hospital } from 'lucide-react';

interface PatientInfoProps {
  patient: Patient;
  className?: string;
}

const PatientInfo: React.FC<PatientInfoProps> = ({ patient, className }) => {
  const statusColor = getStatusColor(patient.status);
  const isInHospital = patient.location?.inHospital;
  
  const getLocationDisplay = () => {
    if (!patient.location) return '';
    return isInHospital 
      ? (patient.room ? `Room ${patient.room}` : 'In Hospital') 
      : `${patient.location.city}, ${patient.location.state}`;
  };
  
  return (
    <div className={`dashboard-card animate-fade-in bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative">
            <img 
              src={patient.avatar} 
              alt={patient.name} 
              className="w-16 h-16 rounded-full border-2 border-white dark:border-gray-700 shadow-md"
            />
            <div className={`${statusColor} absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white dark:border-gray-700`}></div>
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{patient.name}</h2>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {patient.age} years • {patient.gender}
              </span>
              {patient.location && (
                <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                  • 
                  {isInHospital ? 
                    <Hospital className="h-3.5 w-3.5 mx-1" /> : 
                    <Home className="h-3.5 w-3.5 mx-1" />
                  }
                  {getLocationDisplay()}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            patient.status === 'normal' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
              : patient.status === 'warning' 
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' 
                : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
          }`}>
            <span className={`${statusColor} w-2 h-2 rounded-full mr-1.5`}></span>
            {getStatusText(patient.status)}
          </div>
          {patient.condition && (
            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">{patient.condition}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientInfo;
