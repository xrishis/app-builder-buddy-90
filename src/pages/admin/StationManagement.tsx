import { useState } from "react";
import { ArrowLeft, MapPin, Users, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const StationManagement = ({ onBack }: { onBack: () => void }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock station data
  const stations = [
    {
      id: 1,
      name: "New Delhi Railway Station",
      code: "NDLS",
      totalCoolies: 45,
      activeCoolies: 32,
      avgRating: 4.6,
      todayBookings: 156,
      status: "active"
    },
    {
      id: 2,
      name: "Mumbai Central",
      code: "BCT",
      totalCoolies: 38,
      activeCoolies: 28,
      avgRating: 4.4,
      todayBookings: 142,
      status: "active"
    },
    {
      id: 3,
      name: "Howrah Junction",
      code: "HWH",
      totalCoolies: 52,
      activeCoolies: 41,
      avgRating: 4.7,
      todayBookings: 178,
      status: "active"
    },
    {
      id: 4,
      name: "Chennai Central",
      code: "MAS",
      totalCoolies: 33,
      activeCoolies: 24,
      avgRating: 4.5,
      todayBookings: 98,
      status: "active"
    },
    {
      id: 5,
      name: "Bangalore City Junction",
      code: "SBC",
      totalCoolies: 29,
      activeCoolies: 18,
      avgRating: 4.3,
      todayBookings: 87,
      status: "maintenance"
    }
  ];

  const filteredStations = stations.filter(station =>
    station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={onBack} className="mr-3">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Station Management</h1>
              <p className="text-sm text-gray-600">Monitor and manage railway stations</p>
            </div>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Station
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search stations by name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">Filter</Button>
            </div>
          </CardContent>
        </Card>

        {/* Station Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{stations.length}</p>
                <p className="text-sm text-gray-600">Total Stations</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {stations.reduce((sum, station) => sum + station.activeCoolies, 0)}
                </p>
                <p className="text-sm text-gray-600">Active Coolies</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {stations.reduce((sum, station) => sum + station.todayBookings, 0)}
                </p>
                <p className="text-sm text-gray-600">Today's Bookings</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">4.5</p>
                <p className="text-sm text-gray-600">Avg Rating</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stations Table */}
        <Card>
          <CardHeader>
            <CardTitle>Station Details</CardTitle>
            <CardDescription>
              Detailed view of all registered railway stations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Station</TableHead>
                  <TableHead>Coolies</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Today's Bookings</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStations.map((station) => (
                  <TableRow key={station.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{station.name}</p>
                        <p className="text-sm text-gray-600">{station.code}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{station.activeCoolies}/{station.totalCoolies}</p>
                        <p className="text-xs text-gray-600">Active/Total</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        {station.avgRating}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-blue-600">
                        {station.todayBookings}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={station.status === 'active' ? 'default' : 'secondary'}
                      >
                        {station.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          Manage
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StationManagement;