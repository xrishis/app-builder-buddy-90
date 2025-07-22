import { useState } from "react";
import { ArrowLeft, MapPin, Package, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const PassengerBooking = ({ onBack }: { onBack: () => void }) => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    trainNumber: "",
    platform: "",
    luggageType: "",
    estimatedWeight: "",
    pickupLocation: "",
  });
  const { toast } = useToast();

  const handleBookingSubmit = () => {
    toast({
      title: "Booking Confirmed!",
      description: "Looking for available coolies in your area. You'll be notified once a coolie accepts your request.",
    });
    setStep(4);
  };

  const luggageOptions = [
    { value: "light", label: "Light (1-2 bags)", price: "₹50" },
    { value: "medium", label: "Medium (3-5 bags)", price: "₹80" },
    { value: "heavy", label: "Heavy (6+ bags)", price: "₹120" },
  ];

  if (step === 4) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto pt-20">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl text-green-600">Booking Confirmed!</CardTitle>
              <CardDescription>
                We're finding the best coolie for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Booking Details</h4>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Train:</span> {bookingData.trainNumber}</p>
                  <p><span className="font-medium">Platform:</span> {bookingData.platform}</p>
                  <p><span className="font-medium">Luggage:</span> {bookingData.luggageType}</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Estimated arrival: 3-5 minutes
                </p>
                <Button onClick={onBack} className="w-full">
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-3">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-lg font-semibold">Book a Coolie</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= i ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {i}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Train Details</span>
            <span>Luggage Info</span>
            <span>Confirm</span>
          </div>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Train & Platform Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="trainNumber">Train Number</Label>
                <Input
                  id="trainNumber"
                  placeholder="e.g., 12002"
                  value={bookingData.trainNumber}
                  onChange={(e) => setBookingData({...bookingData, trainNumber: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="platform">Platform Number</Label>
                <Input
                  id="platform"
                  placeholder="e.g., Platform 3"
                  value={bookingData.platform}
                  onChange={(e) => setBookingData({...bookingData, platform: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="pickup">Pickup Location (Optional)</Label>
                <Input
                  id="pickup"
                  placeholder="e.g., Near platform entrance"
                  value={bookingData.pickupLocation}
                  onChange={(e) => setBookingData({...bookingData, pickupLocation: e.target.value})}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={() => setStep(2)}
                disabled={!bookingData.trainNumber || !bookingData.platform}
              >
                Next
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Luggage Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Luggage Type & Estimated Price</Label>
                <Select value={bookingData.luggageType} onValueChange={(value) => setBookingData({...bookingData, luggageType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select luggage type" />
                  </SelectTrigger>
                  <SelectContent>
                    {luggageOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex justify-between w-full">
                          <span>{option.label}</span>
                          <span className="font-medium text-green-600">{option.price}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="weight">Estimated Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="e.g., 25"
                  value={bookingData.estimatedWeight}
                  onChange={(e) => setBookingData({...bookingData, estimatedWeight: e.target.value})}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(3)} 
                  className="flex-1"
                  disabled={!bookingData.luggageType}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Confirm Booking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span>Train Number:</span>
                  <span className="font-medium">{bookingData.trainNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform:</span>
                  <span className="font-medium">{bookingData.platform}</span>
                </div>
                <div className="flex justify-between">
                  <span>Luggage:</span>
                  <span className="font-medium">{bookingData.luggageType}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="font-semibold">Estimated Cost:</span>
                  <span className="font-semibold text-green-600">
                    {luggageOptions.find(opt => opt.value === bookingData.luggageType)?.price}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Final payment will be processed after service completion
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleBookingSubmit} className="flex-1">
                  Confirm Booking
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PassengerBooking;