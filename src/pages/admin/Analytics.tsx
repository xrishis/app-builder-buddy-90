import { ArrowLeft, TrendingUp, Users, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Analytics = ({ onBack }: { onBack: () => void }) => {
  // Mock analytics data
  const dailyStats = {
    totalBookings: 247,
    totalRevenue: "₹12,450",
    activeUsers: 189,
    avgRating: 4.6
  };

  const weeklyData = [
    { day: 'Mon', bookings: 45, revenue: 2250 },
    { day: 'Tue', bookings: 52, revenue: 2600 },
    { day: 'Wed', bookings: 38, revenue: 1900 },
    { day: 'Thu', bookings: 61, revenue: 3050 },
    { day: 'Fri', bookings: 73, revenue: 3650 },
    { day: 'Sat', bookings: 67, revenue: 3350 },
    { day: 'Sun', bookings: 55, revenue: 2750 }
  ];

  const topStations = [
    { name: 'New Delhi Railway Station', bookings: 89, revenue: 4450 },
    { name: 'Mumbai Central', bookings: 76, revenue: 3800 },
    { name: 'Howrah Junction', bookings: 71, revenue: 3550 },
    { name: 'Chennai Central', bookings: 63, revenue: 3150 },
    { name: 'Bangalore City Junction', bookings: 48, revenue: 2400 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={onBack} className="mr-3">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Analytics & Reports</h1>
              <p className="text-sm text-gray-600">Detailed insights and performance metrics</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Export Report</Button>
            <Button>Generate Report</Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="stations">Stations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                      <p className="text-3xl font-bold">{dailyStats.totalBookings}</p>
                      <p className="text-xs text-green-600">+12% from yesterday</p>
                    </div>
                    <Calendar className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-3xl font-bold">{dailyStats.totalRevenue}</p>
                      <p className="text-xs text-green-600">+8% from yesterday</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Users</p>
                      <p className="text-3xl font-bold">{dailyStats.activeUsers}</p>
                      <p className="text-xs text-blue-600">+5% from yesterday</p>
                    </div>
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                      <p className="text-3xl font-bold">{dailyStats.avgRating}</p>
                      <p className="text-xs text-green-600">+0.1 from yesterday</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Performance</CardTitle>
                <CardDescription>Bookings and revenue trends over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyData.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <span className="font-medium w-12">{day.day}</span>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(day.bookings / 80) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{day.bookings} bookings</p>
                        <p className="text-sm text-gray-600">₹{day.revenue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Stations</CardTitle>
                <CardDescription>Stations ranked by bookings and revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topStations.map((station, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="font-bold text-blue-600">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{station.name}</p>
                          <p className="text-sm text-gray-600">{station.bookings} bookings today</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">₹{station.revenue}</p>
                        <p className="text-sm text-gray-600">revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Patterns</CardTitle>
                <CardDescription>Analysis of booking trends and patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">65%</p>
                    <p className="text-sm text-gray-600">Mobile Bookings</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">₹78</p>
                    <p className="text-sm text-gray-600">Avg Booking Value</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">4.2</p>
                    <p className="text-sm text-gray-600">Avg Service Time (min)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Detailed revenue analysis and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Revenue by Station Type</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Major Stations</span>
                        <span className="font-medium">₹8,450 (68%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Junction Stations</span>
                        <span className="font-medium">₹2,850 (23%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Local Stations</span>
                        <span className="font-medium">₹1,150 (9%)</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Commission Breakdown</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Platform Commission</span>
                        <span className="font-medium">₹1,245 (10%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Coolie Earnings</span>
                        <span className="font-medium">₹11,205 (90%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;