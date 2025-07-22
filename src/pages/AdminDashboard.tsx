import { useState } from "react";
import { ArrowLeft, Users, MapPin, TrendingUp, AlertTriangle, UserCheck, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StationManagement from "./admin/StationManagement";
import CoolieVerification from "./admin/CoolieVerification";
import Analytics from "./admin/Analytics";
import DisputeManagement from "./admin/DisputeManagement";
import Messaging from "./admin/Messaging";

const AdminDashboard = ({ onBack }: { onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for overview
  const stats = {
    totalCoolies: 156,
    activeCoolies: 89,
    totalBookings: 1247,
    pendingVerifications: 12,
    activeDisputes: 3,
    dailyRevenue: "₹12,450"
  };

  if (activeTab !== "overview") {
    const renderTabContent = () => {
      switch (activeTab) {
        case "stations":
          return <StationManagement onBack={() => setActiveTab("overview")} />;
        case "verification":
          return <CoolieVerification onBack={() => setActiveTab("overview")} />;
        case "analytics":
          return <Analytics onBack={() => setActiveTab("overview")} />;
        case "disputes":
          return <DisputeManagement onBack={() => setActiveTab("overview")} />;
        case "messaging":
          return <Messaging onBack={() => setActiveTab("overview")} />;
        default:
          return null;
      }
    };

    return renderTabContent();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={onBack} className="mr-3">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">CoolieX Admin Panel</h1>
              <p className="text-sm text-gray-600">Manage stations, coolies, and operations</p>
            </div>
          </div>
          <Badge variant="default">Super Admin</Badge>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Coolies</p>
                  <p className="text-3xl font-bold">{stats.totalCoolies}</p>
                  <p className="text-xs text-green-600">
                    {stats.activeCoolies} active now
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-3xl font-bold">{stats.totalBookings}</p>
                  <p className="text-xs text-blue-600">+15% from last week</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Daily Revenue</p>
                  <p className="text-3xl font-bold">{stats.dailyRevenue}</p>
                  <p className="text-xs text-green-600">+8% from yesterday</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("stations")}>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Station Management
              </CardTitle>
              <CardDescription>
                View station-wise coolie availability and manage locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Manage Stations
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("verification")}>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <UserCheck className="w-5 h-5 mr-2 text-green-600" />
                Coolie Verification
              </CardTitle>
              <CardDescription>
                Review and verify coolie applications and documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm">Pending Reviews</span>
                <Badge variant="destructive">{stats.pendingVerifications}</Badge>
              </div>
              <Button className="w-full">
                Review Applications
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("analytics")}>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                Analytics & Reports
              </CardTitle>
              <CardDescription>
                View detailed analytics and generate reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                View Analytics
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("disputes")}>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                Dispute Management
              </CardTitle>
              <CardDescription>
                Handle customer complaints and disputes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm">Active Disputes</span>
                <Badge variant="destructive">{stats.activeDisputes}</Badge>
              </div>
              <Button className="w-full">
                Resolve Disputes
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("messaging")}>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <MessageSquare className="w-5 h-5 mr-2 text-orange-600" />
                Station Messaging
              </CardTitle>
              <CardDescription>
                Broadcast messages to coolies and passengers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Send Messages
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system updates and activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New coolie verified</p>
                  <p className="text-xs text-gray-600">Raj Kumar - New Delhi Railway Station</p>
                </div>
                <span className="text-xs text-gray-500">2 min ago</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Booking completed</p>
                  <p className="text-xs text-gray-600">Train 12002 - Platform 3 - ₹80</p>
                </div>
                <span className="text-xs text-gray-500">5 min ago</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Dispute reported</p>
                  <p className="text-xs text-gray-600">Payment issue - Booking #1247</p>
                </div>
                <span className="text-xs text-gray-500">15 min ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;