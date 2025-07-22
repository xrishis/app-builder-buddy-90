import { useState } from "react";
import { ArrowLeft, AlertTriangle, MessageCircle, Clock, CheckCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const DisputeManagement = ({ onBack }: { onBack: () => void }) => {
  const [disputes, setDisputes] = useState([
    {
      id: 1,
      bookingId: "BK001247",
      type: "Payment Issue",
      description: "Payment was deducted but coolie didn't receive amount",
      passengerName: "Rahul Kumar",
      coolieName: "Raj Singh",
      station: "New Delhi",
      status: "open",
      priority: "high",
      createdAt: "2024-01-15 10:30",
      amount: "₹80"
    },
    {
      id: 2,
      bookingId: "BK001246",
      type: "Service Quality",
      description: "Coolie was rude and didn't handle luggage properly",
      passengerName: "Priya Sharma",
      coolieName: "Mohammed Ali",
      station: "Mumbai Central",
      status: "investigating",
      priority: "medium",
      createdAt: "2024-01-15 09:15",
      amount: "₹50"
    },
    {
      id: 3,
      bookingId: "BK001245",
      type: "No Show",
      description: "Coolie didn't arrive at pickup location",
      passengerName: "Amit Patel",
      coolieName: "Suresh Kumar",
      station: "Ahmedabad Junction",
      status: "resolved",
      priority: "high",
      createdAt: "2024-01-14 16:45",
      amount: "₹120"
    }
  ]);

  const [selectedDispute, setSelectedDispute] = useState(null);
  const [resolution, setResolution] = useState("");
  const { toast } = useToast();

  const handleResolveDispute = (disputeId: number, resolutionNote: string) => {
    setDisputes(prev =>
      prev.map(dispute =>
        dispute.id === disputeId 
          ? { ...dispute, status: 'resolved', resolution: resolutionNote }
          : dispute
      )
    );
    toast({
      title: "Dispute Resolved",
      description: "The dispute has been marked as resolved and parties have been notified.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="destructive">Open</Badge>;
      case 'investigating':
        return <Badge variant="secondary">Investigating</Badge>;
      case 'resolved':
        return <Badge variant="default">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">High</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="text-xs">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-xs">Low</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{priority}</Badge>;
    }
  };

  const openDisputes = disputes.filter(d => d.status === 'open').length;
  const investigatingDisputes = disputes.filter(d => d.status === 'investigating').length;
  const resolvedDisputes = disputes.filter(d => d.status === 'resolved').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={onBack} className="mr-3">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Dispute Management</h1>
              <p className="text-sm text-gray-600">Handle customer complaints and resolve disputes</p>
            </div>
          </div>
          <Badge variant="destructive">
            {openDisputes} Open Disputes
          </Badge>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-red-600">{openDisputes}</p>
                  <p className="text-sm text-gray-600">Open Disputes</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-orange-600">{investigatingDisputes}</p>
                  <p className="text-sm text-gray-600">Investigating</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">{resolvedDisputes}</p>
                  <p className="text-sm text-gray-600">Resolved</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {resolvedDisputes > 0 ? Math.round((resolvedDisputes / disputes.length) * 100) : 0}%
                  </p>
                  <p className="text-sm text-gray-600">Resolution Rate</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Disputes Table */}
        <Card>
          <CardHeader>
            <CardTitle>Active Disputes</CardTitle>
            <CardDescription>
              List of all customer disputes and complaints
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dispute Details</TableHead>
                  <TableHead>Parties Involved</TableHead>
                  <TableHead>Station</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {disputes.map((dispute) => (
                  <TableRow key={dispute.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{dispute.type}</p>
                        <p className="text-sm text-gray-600 max-w-xs truncate">
                          {dispute.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          Booking: {dispute.bookingId} • {dispute.createdAt}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p><span className="font-medium">Passenger:</span> {dispute.passengerName}</p>
                        <p><span className="font-medium">Coolie:</span> {dispute.coolieName}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{dispute.station}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-green-600">
                        {dispute.amount}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(dispute.status)}
                    </TableCell>
                    <TableCell>
                      {getPriorityBadge(dispute.priority)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <MessageCircle className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Dispute Details - {dispute.bookingId}</DialogTitle>
                              <DialogDescription>
                                Review and resolve this dispute
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Dispute Information</h4>
                                  <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Type:</span> {dispute.type}</p>
                                    <p><span className="font-medium">Amount:</span> {dispute.amount}</p>
                                    <p><span className="font-medium">Date:</span> {dispute.createdAt}</p>
                                    <p><span className="font-medium">Status:</span> {dispute.status}</p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Parties Involved</h4>
                                  <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Passenger:</span> {dispute.passengerName}</p>
                                    <p><span className="font-medium">Coolie:</span> {dispute.coolieName}</p>
                                    <p><span className="font-medium">Station:</span> {dispute.station}</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold mb-2">Description</h4>
                                <p className="text-sm bg-gray-50 p-3 rounded-lg">{dispute.description}</p>
                              </div>

                              {dispute.status !== 'resolved' && (
                                <div>
                                  <h4 className="font-semibold mb-2">Resolution Notes</h4>
                                  <Textarea
                                    placeholder="Enter resolution details and actions taken..."
                                    value={resolution}
                                    onChange={(e) => setResolution(e.target.value)}
                                  />
                                  <div className="flex gap-2 mt-3">
                                    <Button 
                                      variant="outline" 
                                      onClick={() => {
                                        setDisputes(prev =>
                                          prev.map(d =>
                                            d.id === dispute.id 
                                              ? { ...d, status: 'investigating' }
                                              : d
                                          )
                                        );
                                      }}
                                    >
                                      Mark as Investigating
                                    </Button>
                                    <Button 
                                      onClick={() => {
                                        if (resolution.trim()) {
                                          handleResolveDispute(dispute.id, resolution);
                                          setResolution("");
                                        }
                                      }}
                                      disabled={!resolution.trim()}
                                    >
                                      Mark as Resolved
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
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

export default DisputeManagement;