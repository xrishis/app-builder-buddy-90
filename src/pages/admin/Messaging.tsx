import { useState } from "react";
import { ArrowLeft, Send, MessageSquare, Users, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const Messaging = ({ onBack }: { onBack: () => void }) => {
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [audience, setAudience] = useState("");
  const [station, setStation] = useState("");
  const { toast } = useToast();

  const [sentMessages, setSentMessages] = useState([
    {
      id: 1,
      title: "Platform 3 Maintenance",
      message: "Platform 3 will be under maintenance from 2 PM to 4 PM today. Please adjust your services accordingly.",
      audience: "coolies",
      station: "New Delhi Railway Station",
      sentAt: "2024-01-15 10:30",
      recipients: 45
    },
    {
      id: 2,
      title: "Service Quality Reminder",
      message: "Please ensure courteous behavior and careful handling of passenger luggage. Your ratings affect platform standing.",
      audience: "coolies",
      station: "All Stations",
      sentAt: "2024-01-15 08:00",
      recipients: 156
    },
    {
      id: 3,
      title: "App Update Available",
      message: "A new app update is available with improved features. Please update from the app store.",
      audience: "all",
      station: "All Stations",
      sentAt: "2024-01-14 16:00",
      recipients: 1247
    }
  ]);

  const stations = [
    "All Stations",
    "New Delhi Railway Station",
    "Mumbai Central",
    "Howrah Junction",
    "Chennai Central",
    "Bangalore City Junction"
  ];

  const handleSendMessage = () => {
    if (!title.trim() || !message.trim() || !audience || !station) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newMessage = {
      id: sentMessages.length + 1,
      title,
      message,
      audience,
      station,
      sentAt: new Date().toLocaleString(),
      recipients: audience === 'all' ? 1247 : audience === 'coolies' ? 156 : 891
    };

    setSentMessages(prev => [newMessage, ...prev]);
    setTitle("");
    setMessage("");
    setAudience("");
    setStation("");

    toast({
      title: "Message Sent Successfully",
      description: `Your message has been sent to ${newMessage.recipients} recipients.`,
    });
  };

  const getAudienceBadge = (audience: string) => {
    switch (audience) {
      case 'coolies':
        return <Badge variant="default">Coolies</Badge>;
      case 'passengers':
        return <Badge variant="secondary">Passengers</Badge>;
      case 'all':
        return <Badge variant="outline">All Users</Badge>;
      default:
        return <Badge variant="outline">{audience}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-3">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Station Messaging</h1>
            <p className="text-sm text-gray-600">Broadcast messages to coolies and passengers</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message Composition */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Megaphone className="w-5 h-5 mr-2" />
                  Compose Message
                </CardTitle>
                <CardDescription>
                  Send announcements to coolies and passengers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Message Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Platform Maintenance Notice"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="audience">Audience</Label>
                    <Select value={audience} onValueChange={setAudience}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="coolies">Coolies Only</SelectItem>
                        <SelectItem value="passengers">Passengers Only</SelectItem>
                        <SelectItem value="all">All Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="station">Station</Label>
                    <Select value={station} onValueChange={setStation}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select station" />
                      </SelectTrigger>
                      <SelectContent>
                        {stations.map((stationName) => (
                          <SelectItem key={stationName} value={stationName}>
                            {stationName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Message Content</Label>
                  <Textarea
                    id="message"
                    placeholder="Enter your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button 
                  onClick={handleSendMessage}
                  className="w-full"
                  disabled={!title.trim() || !message.trim() || !audience || !station}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Statistics */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-base">Message Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm">Total Coolies</span>
                  </div>
                  <span className="font-semibold">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm">Total Passengers</span>
                  </div>
                  <span className="font-semibold">891</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 text-purple-600 mr-2" />
                    <span className="text-sm">Messages Today</span>
                  </div>
                  <span className="font-semibold">3</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-left"
                  onClick={() => {
                    setTitle("Platform Maintenance Notice");
                    setMessage("Platform maintenance scheduled. Please adjust services accordingly and inform passengers about potential delays.");
                  }}
                >
                  Platform Maintenance
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-left"
                  onClick={() => {
                    setTitle("Service Quality Reminder");
                    setMessage("Please ensure courteous behavior and careful handling of passenger luggage. Your ratings affect your platform standing.");
                  }}
                >
                  Service Quality
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-left"
                  onClick={() => {
                    setTitle("Weather Alert");
                    setMessage("Heavy rain expected today. Please take extra care with luggage protection and ensure passenger safety.");
                  }}
                >
                  Weather Alert
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sent Messages History */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Message History</CardTitle>
            <CardDescription>
              Recently sent messages and announcements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sentMessages.map((msg) => (
                <div key={msg.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{msg.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{msg.message}</p>
                    </div>
                    <div className="text-right">
                      {getAudienceBadge(msg.audience)}
                      <p className="text-xs text-gray-500 mt-1">{msg.recipients} recipients</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Station: {msg.station}</span>
                    <span>Sent: {msg.sentAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Messaging;