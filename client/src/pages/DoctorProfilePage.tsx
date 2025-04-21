
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import DoctorProfile from '@/components/doctor/DoctorProfile';
import { useToast } from '@/components/ui/use-toast';

const DoctorProfilePage = () => {
  const { toast } = useToast();
  const [doctor, setDoctor] = useState({
    id: "current-user",
    name: "Dr. Tamirat Kebede",
    email: "tamirat.kebede@codoctor.com",
    role: "Cardiologist",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    department: "Cardiology",
    specialty: "Interventional Cardiology",
    age: 42,
    bio: "Dr. Tamirat Kebede is a board-certified cardiologist with over 15 years of experience in interventional cardiology. She specializes in treating complex coronary artery diseases and structural heart conditions.",
    experience: 15,
    education: "MD from Harvard Medical School, Cardiology Fellowship at Johns Hopkins Hospital"
  });

  const handleDoctorUpdate = (updatedDoctor: any) => {
    setDoctor(updatedDoctor);
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully."
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">My Profile</h1>
          <DoctorProfile
            doctor={doctor}
            onDoctorUpdate={handleDoctorUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default DoctorProfilePage;
