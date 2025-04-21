
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Patient } from "@/utils/dummyData";

interface PatientVisitsProps {
  patient: Patient;
}

const PatientVisits: React.FC<PatientVisitsProps> = ({ patient }) => {
  return (
    <div>
      <h3 className="font-medium mb-2">Recent Visits</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Doctor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patient.recentVisits ? (
            patient.recentVisits.map((visit, index) => (
              <TableRow key={index}>
                <TableCell>{visit.date}</TableCell>
                <TableCell>{visit.reason}</TableCell>
                <TableCell>{visit.doctor}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center">No recent visits</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PatientVisits;
