import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Train, User } from "lucide-react";

interface PNRValidatorProps {
  onSuccess: () => void;
}

const PNRValidator = ({ onSuccess }: PNRValidatorProps) => {
  const [pnr, setPnr] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passengerData, setPassengerData] = useState<any>(null);
  const { toast } = useToast();

  const handlePNRSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pnr.length !== 10) {
      toast({
        title: "Invalid PNR",
        description: "PNR must be exactly 10 digits",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // First validate PNR with our edge function
      const { data: pnrData, error: pnrError } = await supabase.functions.invoke('pnr-login', {
        body: { pnr }
      });

      if (pnrError) {
        console.error('PNR validation error:', pnrError);
        toast({
          title: "Validation Error",
          description: "Failed to validate PNR. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Create demo user account for this passenger
      const passengerEmail = `passenger_${pnr}@demo.com`;
      const passengerPassword = `demo123`;

      // Try to sign in first
      let authResult = await supabase.auth.signInWithPassword({
        email: passengerEmail,
        password: passengerPassword
      });

      // If sign in fails, create new account
      if (authResult.error) {
        authResult = await supabase.auth.signUp({
          email: passengerEmail,
          password: passengerPassword,
          options: {
            data: {
              role: 'passenger',
              pnr: pnr,
              name: pnrData.passenger.name
            }
          }
        });
      }

      if (authResult.error) {
        console.error('Auth error:', authResult.error);
        toast({
          title: "Authentication Error",
          description: "Failed to authenticate. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Store passenger data and proceed
      setPassengerData(pnrData.passenger);

      toast({
        title: "PNR Verified!",
        description: `Welcome ${pnrData.passenger.name}`,
      });

      // Success - proceed to app
      onSuccess();

    } catch (error) {
      console.error('PNR validation error:', error);
      toast({
        title: "Validation Error",
        description: "Failed to validate PNR. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <Train className="h-8 w-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Passenger Login</CardTitle>
        <CardDescription>
          Enter your 10-digit PNR number to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!passengerData ? (
          <form onSubmit={handlePNRSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pnr">PNR Number</Label>
              <Input
                id="pnr"
                type="text"
                placeholder="Enter 10-digit PNR"
                value={pnr}
                onChange={(e) => setPnr(e.target.value.replace(/\D/g, '').slice(0, 10))}
                maxLength={10}
                required
                className="text-center text-lg tracking-wider"
              />
              <p className="text-sm text-muted-foreground">
                Try: 1234567890, 9876543210, or any 10-digit number
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || pnr.length !== 10}>
              {isLoading ? "Validating..." : "Verify PNR"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <User className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">PNR Verified!</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">PNR:</span>
                <span>{passengerData.pnr}</span>
              </div>
              {passengerData.name && (
                <div className="flex justify-between">
                  <span className="font-medium">Name:</span>
                  <span>{passengerData.name}</span>
                </div>
              )}
              {passengerData.train_number && (
                <div className="flex justify-between">
                  <span className="font-medium">Train:</span>
                  <span>{passengerData.train_number}</span>
                </div>
              )}
              {passengerData.coach && (
                <div className="flex justify-between">
                  <span className="font-medium">Coach:</span>
                  <span>{passengerData.coach}</span>
                </div>
              )}
              {passengerData.seat && (
                <div className="flex justify-between">
                  <span className="font-medium">Seat:</span>
                  <span>{passengerData.seat}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PNRValidator;