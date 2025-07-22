import { useState } from "react";
import RoleSelection from "./RoleSelection";
import PassengerBooking from "./PassengerBooking";
import CoolieDashboard from "./CoolieDashboard";
import AdminDashboard from "./AdminDashboard";

const Index = () => {
  const [currentView, setCurrentView] = useState<'selection' | 'passenger' | 'coolie' | 'admin'>('selection');

  const handleRoleSelect = (role: 'passenger' | 'coolie' | 'admin') => {
    setCurrentView(role);
  };

  const handleBack = () => {
    setCurrentView('selection');
  };

  if (currentView === 'passenger') {
    return <PassengerBooking onBack={handleBack} />;
  }

  if (currentView === 'coolie') {
    return <CoolieDashboard onBack={handleBack} />;
  }

  if (currentView === 'admin') {
    return <AdminDashboard onBack={handleBack} />;
  }

  return <RoleSelection onRoleSelect={handleRoleSelect} />;
};

export default Index;
