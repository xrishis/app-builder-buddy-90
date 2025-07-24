import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import RoleSelection from "./RoleSelection";
import PassengerBooking from "./PassengerBooking";
import CoolieDashboard from "./CoolieDashboard";
import AdminDashboard from "./AdminDashboard";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Index = () => {
  const { user, session, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'selection' | 'passenger' | 'coolie' | 'admin'>('selection');
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !session) {
      navigate('/auth');
      return;
    }

    if (session?.user) {
      // Get user's role from profile
      const fetchUserRole = async () => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUserRole(profile.role);
          // Auto-navigate to user's role dashboard if they have a specific role
          if (profile.role === 'passenger' || profile.role === 'coolie') {
            setCurrentView(profile.role);
          }
        }
      };
      fetchUserRole();
    }
  }, [session, loading, navigate]);

  const handleRoleSelect = (role: 'passenger' | 'coolie' | 'admin') => {
    setCurrentView(role);
  };

  const handleBack = () => {
    setCurrentView('selection');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to auth
  }

  if (currentView === 'passenger') {
    return (
      <div>
        <div className="absolute top-4 right-4">
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
        <PassengerBooking onBack={handleBack} />
      </div>
    );
  }

  if (currentView === 'coolie') {
    return (
      <div>
        <div className="absolute top-4 right-4">
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
        <CoolieDashboard onBack={handleBack} />
      </div>
    );
  }

  if (currentView === 'admin') {
    return (
      <div>
        <div className="absolute top-4 right-4">
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
        <AdminDashboard onBack={handleBack} />
      </div>
    );
  }

  return (
    <div>
      <div className="absolute top-4 right-4">
        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
      <RoleSelection onRoleSelect={handleRoleSelect} />
    </div>
  );
};

export default Index;
