import { useState } from "react";
import RoleSelection from "./RoleSelection";
import PassengerBooking from "./PassengerBooking";
import CoolieDashboard from "./CoolieDashboard";

const Index = () => {
  const [currentView, setCurrentView] = useState<'selection' | 'passenger' | 'coolie'>('selection');

  const handleRoleSelect = (role: 'passenger' | 'coolie') => {
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

  return <RoleSelection onRoleSelect={handleRoleSelect} />;
};

export default Index;
