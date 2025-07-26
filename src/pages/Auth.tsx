import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Users, Phone, Mail } from "lucide-react";
import PNRValidator from "@/components/PNRValidator";

interface AuthProps {
  onAuthSuccess: () => void;
}

const Auth = ({ onAuthSuccess }: AuthProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'passenger' | 'coolie'>('passenger');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        onAuthSuccess();
      }
    };
    checkUser();
  }, [onAuthSuccess]);

  const sendOTP = async () => {
    if (!phone || phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    // Skip real OTP sending, just simulate success
    setTimeout(() => {
      setOtpSent(true);
      setIsLoading(false);
      toast({
        title: "OTP Sent!",
        description: "Enter any 6-digit code to continue (dummy mode)",
      });
    }, 1000);
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit verification code",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Skip real OTP verification, create anonymous session
      const { data, error } = await supabase.auth.signInAnonymously();

      if (error) {
        toast({
          title: "Verification Failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Create coolie profile and user profile
      if (data.user) {
        // Insert into coolies table
        await supabase.from('coolies').insert({
          phone: phone,
          name: name || ''
        });

        // Insert into profiles table
        await supabase.from('profiles').insert({
          id: data.user.id,
          role: 'coolie'
        });
      }

      toast({
        title: "Success!",
        description: "Successfully verified and logged in.",
      });
      onAuthSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Verification failed",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: 'fallback-password' // Temporary fallback
      });

      if (error) {
        toast({
          title: "Email Login Failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Welcome back!",
        description: "Successfully logged in with email.",
      });
      onAuthSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Email login failed",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePNRSuccess = (passengerData: any, session: any) => {
    toast({
      title: "Login Successful!",
      description: `Welcome ${passengerData.name || 'Passenger'}`,
    });
    onAuthSuccess();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">CoolieX</h1>
          <p className="text-gray-600">Choose your login method</p>
        </div>

        <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as 'passenger' | 'coolie')}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="passenger" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Passenger</span>
            </TabsTrigger>
            <TabsTrigger value="coolie" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Coolie</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="passenger">
            <PNRValidator onSuccess={handlePNRSuccess} />
          </TabsContent>
          
          <TabsContent value="coolie">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <Phone className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-bold">Coolie Login</CardTitle>
                <CardDescription>
                  {otpSent ? 'Enter the verification code' : 'Login with your phone number'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!otpSent ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                          +91
                        </span>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter 10-digit number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          maxLength={10}
                          className="rounded-l-none"
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={sendOTP} 
                      className="w-full" 
                      disabled={isLoading || phone.length !== 10}
                    >
                      {isLoading ? "Sending OTP..." : "Send OTP"}
                    </Button>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or continue with email
                        </span>
                      </div>
                    </div>
                    
                    <form onSubmit={handleEmailAuth} className="space-y-3">
                      <Input
                        type="email"
                        placeholder="Email (fallback)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Button type="submit" variant="outline" className="w-full" size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Continue with Email
                      </Button>
                    </form>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-4">
                        We sent a code to +91{phone}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="otp">Verification Code</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        maxLength={6}
                        className="text-center text-lg tracking-wider"
                      />
                    </div>
                    <Button 
                      onClick={verifyOTP} 
                      className="w-full" 
                      disabled={isLoading || otp.length !== 6}
                    >
                      {isLoading ? "Verifying..." : "Verify & Login"}
                    </Button>
                    <Button 
                      onClick={() => {
                        setOtpSent(false);
                        setOtp('');
                      }} 
                      variant="outline" 
                      className="w-full"
                    >
                      Change Phone Number
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;