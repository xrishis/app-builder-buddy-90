import { Users, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const RoleSelection = ({ onRoleSelect }: { onRoleSelect: (role: 'passenger' | 'coolie') => void }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to CoolieX</h1>
          <p className="text-lg text-gray-600">Your trusted railway porter booking platform</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onRoleSelect('passenger')}>
            <CardHeader className="text-center">
              <Users className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-2xl">I'm a Passenger</CardTitle>
              <CardDescription className="text-base">
                Book a verified coolie for your luggage at railway stations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Quick booking with train details
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Real-time coolie tracking
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Cashless payments
                </div>
              </div>
              <Button className="w-full" size="lg">
                Book a Coolie
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onRoleSelect('coolie')}>
            <CardHeader className="text-center">
              <UserCheck className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-2xl">I'm a Coolie</CardTitle>
              <CardDescription className="text-base">
                Join our platform and earn steady income with verified bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  Receive booking requests
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  Track earnings & payments
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  Verified partner status
                </div>
              </div>
              <Button className="w-full" variant="outline" size="lg">
                Start Earning
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;