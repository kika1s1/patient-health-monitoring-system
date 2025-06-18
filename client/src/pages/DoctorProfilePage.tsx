
import React, { useState } from 'react';
import Header from '@/components/Header';
import DoctorProfile from '@/components/doctor/DoctorProfile';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from "../store/useAuthStore";

const DoctorProfilePage = () => {
  const { authUser } = useAuthStore();

  const { toast } = useToast();
  const [doctor, setDoctor] = useState({
    id: authUser?.id,
    name: authUser?.fullName ,
    email: authUser?.email || "N/A",
    role: authUser?.role || "Doctor",
    avatar: authUser?.avatarUrl,
    phoneNumber: authUser?.phoneNumber || "N/A",
    department: authUser?.department || "N/A",
    specialty: authUser?.specialty || "N/A",
    age: authUser?.age,
    bio: authUser?.bio || "N/A",
    experience: authUser?.experience ,
    education: authUser?.education || "N/A",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
