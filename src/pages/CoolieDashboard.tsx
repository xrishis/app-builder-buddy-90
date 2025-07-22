import { useState } from "react";
import { ArrowLeft, CheckCircle, Clock, DollarSign, MapPin, Package, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const CoolieDashboard = ({ onBack }: { onBack: () => void }) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [activeRequests, setActiveRequests] = useState([
    {
      id: 1,
      trainNumber: "12002",
      platform: "Platform 3",
      luggageType: "Medium (3-5 bags)",
      estimatedPrice: "₹80",
      passengerName: "Rahul Kumar",
      pickupLocation: "Near platform entrance",
      distance: "2 min walk",
      status: "pending"
    },
    {
      id: 2,
      trainNumber: "12345",
      platform: "Platform 1",
      luggageType: "Light (1-2 bags)",
      estimatedPrice: "₹50",
      passengerName: "Priya Sharma",
      pickupLocation: "Platform 1 ticket counter",
      distance: "5 min walk",
      status: "pending"
    }
  ]);
  const { toast } = useToast();

  const handleAcceptRequest = (requestId: number) => {
    setActiveRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: 'accepted' } : req
      )
    );
    toast({
      title: "Request Accepted!",
      description: "Passenger has been notified. Navigate to pickup location.",
    });
  };

  const handleDeclineRequest = (requestId: number) => {
    setActiveRequests(prev => prev.filter(req => req.id !== requestId));
    toast({
      title: "Request Declined",
      description: "Looking for other available coolies for this passenger.",
    });
  };

  const todayEarnings = "₹340";
  const weeklyEarnings = "₹2,150";
  const completedJobs = 8;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={onBack} className="mr-3">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-semibold">Coolie Dashboard</h1>
          </div>
          <Badge variant={isAvailable ? "default" : "secondary"}>
            {isAvailable ? "Available" : "Offline"}
          </Badge>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Availability Toggle */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="availability" className="text-base font-medium">
                  Available for Bookings
                </Label>
                <p className="text-sm text-gray-600">
                  Turn on to receive booking requests
                </p>
              </div>
              <Switch
                id="availability"
                checked={isAvailable}
                onCheckedChange={setIsAvailable}
              />
            </div>
          </CardContent>
        </Card>

        {/* Earnings Summary */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="text-center">
                <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Today</p>
                <p className="font-bold text-green-600">{todayEarnings}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="text-center">
                <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">This Week</p>
                <p className="font-bold text-blue-600">{weeklyEarnings}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="text-center">
                <CheckCircle className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Jobs Done</p>
                <p className="font-bold text-purple-600">{completedJobs}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Requests */}
        <div>
          <h2 className="text-lg font-semibold mb-3">
            Active Requests ({activeRequests.filter(req => req.status === 'pending').length})
          </h2>
          
          {!isAvailable && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-4">
                <p className="text-orange-800 text-center">
                  Turn on availability to see booking requests
                </p>
              </CardContent>
            </Card>
          )}

          {isAvailable && activeRequests.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No active requests</p>
                <p className="text-sm text-gray-500">You'll be notified when passengers need help</p>
              </CardContent>
            </Card>
          )}

          {isAvailable && activeRequests.map((request) => (
            <Card key={request.id} className="mb-3">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{request.passengerName}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {request.distance}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    {request.estimatedPrice}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Train:</span>
                    <span className="font-medium">{request.trainNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform:</span>
                    <span className="font-medium">{request.platform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Luggage:</span>
                    <span className="font-medium">{request.luggageType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pickup:</span>
                    <span className="font-medium">{request.pickupLocation}</span>
                  </div>
                </div>

                {request.status === 'pending' && (
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleDeclineRequest(request.id)}
                    >
                      Decline
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleAcceptRequest(request.id)}
                    >
                      Accept
                    </Button>
                  </div>
                )}

                {request.status === 'accepted' && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">Accepted</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <MapPin className="w-4 h-4 mr-2" />
                        Navigate
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoolieDashboard;