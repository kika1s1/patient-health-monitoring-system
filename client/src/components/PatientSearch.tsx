
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { User, Search, X } from 'lucide-react';
import { Patient } from '@/utils/dummyData';

interface PatientSearchProps {
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
}

const PatientSearch: React.FC<PatientSearchProps> = ({ patients, onSelectPatient }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const results = patients.filter(
      patient =>
        patient.name.toLowerCase().includes(query) ||
        patient.id.toLowerCase().includes(query) ||
        patient.condition?.toLowerCase().includes(query) ||
        `room ${patient.room}`.toLowerCase().includes(query) ||
        `${patient.age}`.includes(query)
    );

    setSearchResults(results);
  }, [searchQuery, patients]);

  return (
    <div className="relative">
      <div className="flex items-center relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
        <Input
          className="pl-9 pr-12 w-full"
          placeholder="Search patients..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsSearching(e.target.value.trim() !== '');
          }}
        />
        {searchQuery && (
          <button 
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            onClick={() => {
              setSearchQuery('');
              setIsSearching(false);
            }}
          >
            <X className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />
          </button>
        )}
      </div>

      {isSearching && searchResults.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {searchResults.map(patient => (
            <div
              key={patient.id}
              className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                onSelectPatient(patient.id);
                setSearchQuery('');
                setIsSearching(false);
              }}
            >
              <div className="relative mr-2">
                <img
                  src={patient.avatar}
                  alt={patient.name}
                  className="h-8 w-8 rounded-full"
                />
                <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white dark:border-gray-800 ${
                  patient.status === 'critical'
                    ? 'bg-red-500'
                    : patient.status === 'warning'
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{patient.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {patient.age} years • {patient.gender} {patient.room ? `• Room ${patient.room}` : ''}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isSearching && searchQuery && searchResults.length === 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-4 text-center">
          <User className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" />
          <p className="text-gray-700 dark:text-gray-300">No patients found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
};

export default PatientSearch;
