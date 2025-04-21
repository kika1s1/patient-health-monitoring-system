
import React, { useState } from 'react';
import { getStatusColor, getStatusText } from '@/data/dataGenerators';
import type { Patient } from '@/data/types';
import { Filter, Home, Hospital } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PatientListProps {
  patients: Patient[];
  selectedPatientId: string;
  onSelectPatient: (patientId: string) => void;
}

const PatientList: React.FC<PatientListProps> = ({
  patients,
  selectedPatientId,
  onSelectPatient,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'normal' | 'warning' | 'critical'>('all');
  
  const filteredPatients = patients.filter(patient => {
    if (statusFilter === 'all') return true;
    return patient.status === statusFilter;
  });

  const getFilterBadgeColor = () => {
    switch (statusFilter) {
      case 'normal':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
      case 'warning':
        return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';  
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getLocationDisplay = (patient: Patient) => {
    if (!patient.location) return 'Unknown';
    
    if (patient.location.inHospital) {
      return patient.room ? `Room ${patient.room}` : 'In Hospital';
    } else {
      return patient.location.city;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Patients</h2>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 gap-1 border-dashed"
              >
                <Filter className="h-3.5 w-3.5" />
                <span>Filter</span>
                {statusFilter !== 'all' && (
                  <Badge variant="outline" className={`ml-1 py-0 px-1.5 h-5 ${getFilterBadgeColor()}`}>
                    {getStatusText(statusFilter)}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setStatusFilter('all')}
                className={statusFilter === 'all' ? 'bg-accent text-accent-foreground font-medium' : ''}
              >
                All patients
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setStatusFilter('normal')}
                className={statusFilter === 'normal' ? 'bg-accent text-accent-foreground font-medium' : ''}
              >
                <div className="w-2 h-2 rounded-full bg-status-normal mr-2"></div>
                Normal
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setStatusFilter('warning')}
                className={statusFilter === 'warning' ? 'bg-accent text-accent-foreground font-medium' : ''}
              >
                <div className="w-2 h-2 rounded-full bg-status-warning mr-2"></div>
                Warning
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setStatusFilter('critical')}
                className={statusFilter === 'critical' ? 'bg-accent text-accent-foreground font-medium' : ''}
              >
                <div className="w-2 h-2 rounded-full bg-status-critical mr-2"></div>
                Critical
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing: {filteredPatients.length} of {patients.length}
        </p>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[500px] overflow-y-auto">
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => {
            const isActive = patient.id === selectedPatientId;
            const statusColor = getStatusColor(patient.status);
            const isInHospital = patient.location?.inHospital;
            
            return (
              <div
                key={patient.id}
                className={`flex items-center gap-3 p-4 cursor-pointer patient-card ${
                  isActive 
                    ? 'active bg-blue-50 dark:bg-blue-900/30' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => onSelectPatient(patient.id)}
              >
                <div className="relative">
                  <img 
                    src={patient.avatar} 
                    alt={patient.name}
                    className="w-10 h-10 rounded-full mr-3 shadow-sm" 
                  />
                  <div className={`${statusColor} absolute bottom-0 right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                    {patient.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {patient.age} years • {patient.condition || 'Monitoring'}
                  </p>
                </div>
                <div className="ml-2 px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs flex items-center">
                  {isInHospital ? 
                    <Hospital className="h-3 w-3 mr-1" /> : 
                    <Home className="h-3 w-3 mr-1" />
                  }
                  {getLocationDisplay(patient)}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">No patients match the selected filter.</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3"
              onClick={() => setStatusFilter('all')}
            >
              Clear filter
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientList;
