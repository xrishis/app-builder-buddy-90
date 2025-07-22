import { useState } from "react";
import { ArrowLeft, UserCheck, X, Check, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const CoolieVerification = ({ onBack }: { onBack: () => void }) => {
  const [applications, setApplications] = useState([
    {
      id: 1,
      name: "Raj Kumar Singh",
      station: "New Delhi Railway Station",
      phone: "+91 98765 43210",
      experience: "5 years",
      documents: ["Aadhar Card", "Railway ID", "Police Verification"],
      status: "pending",
      appliedDate: "2024-01-15",
      rating: null
    },
    {
      id: 2,
      name: "Mohammed Ali",
      station: "Mumbai Central",
      phone: "+91 87654 32109",
      experience: "3 years",
      documents: ["Aadhar Card", "Railway ID"],
      status: "pending",
      appliedDate: "2024-01-14",
      rating: null
    },
    {
      id: 3,
      name: "Ramesh Kumar",
      station: "Howrah Junction",
      phone: "+91 76543 21098",
      experience: "8 years",
      documents: ["Aadhar Card", "Railway ID", "Police Verification", "Medical Certificate"],
      status: "approved",
      appliedDate: "2024-01-10",
      rating: 4.8
    },
    {
      id: 4,
      name: "Suresh Patil",
      station: "Chennai Central",
      phone: "+91 65432 10987",
      experience: "2 years",
      documents: ["Aadhar Card"],
      status: "rejected",
      appliedDate: "2024-01-12",
      rating: null
    }
  ]);

  const { toast } = useToast();

  const handleApprove = (id: number) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === id ? { ...app, status: 'approved' } : app
      )
    );
    toast({
      title: "Application Approved",
      description: "Coolie has been verified and can start accepting bookings.",
    });
  };

  const handleReject = (id: number) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === id ? { ...app, status: 'rejected' } : app
      )
    );
    toast({
      title: "Application Rejected",
      description: "Coolie has been notified about the rejection.",
      variant: "destructive"
    });
  };

  const pendingCount = applications.filter(app => app.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={onBack} className="mr-3">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Coolie Verification</h1>
              <p className="text-sm text-gray-600">Review and verify coolie applications</p>
            </div>
          </div>
          <Badge variant="destructive">
            {pendingCount} Pending
          </Badge>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
                <p className="text-sm text-gray-600">Pending Review</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {applications.filter(app => app.status === 'approved').length}
                </p>
                <p className="text-sm text-gray-600">Approved</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {applications.filter(app => app.status === 'rejected').length}
                </p>
                <p className="text-sm text-gray-600">Rejected</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{applications.length}</p>
                <p className="text-sm text-gray-600">Total Applications</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
            <CardDescription>
              Review coolie applications and verify documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Station</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{application.name}</p>
                        <p className="text-sm text-gray-600">{application.phone}</p>
                        <p className="text-xs text-gray-500">Applied: {application.appliedDate}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{application.station}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{application.experience}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {application.documents.map((doc, index) => (
                          <div key={index} className="flex items-center text-xs">
                            <Check className="w-3 h-3 text-green-600 mr-1" />
                            {doc}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          application.status === 'approved' ? 'default' :
                          application.status === 'rejected' ? 'destructive' : 'secondary'
                        }
                      >
                        {application.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Application Details - {application.name}</DialogTitle>
                              <DialogDescription>
                                Complete application information and documents
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Personal Information</h4>
                                  <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Name:</span> {application.name}</p>
                                    <p><span className="font-medium">Phone:</span> {application.phone}</p>
                                    <p><span className="font-medium">Experience:</span> {application.experience}</p>
                                    <p><span className="font-medium">Station:</span> {application.station}</p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Documents Submitted</h4>
                                  <div className="space-y-2">
                                    {application.documents.map((doc, index) => (
                                      <div key={index} className="flex items-center justify-between">
                                        <span className="text-sm">{doc}</span>
                                        <Button size="sm" variant="outline">
                                          <Download className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              {application.status === 'pending' && (
                                <div className="flex gap-2 pt-4">
                                  <Button 
                                    onClick={() => handleReject(application.id)}
                                    variant="destructive" 
                                    className="flex-1"
                                  >
                                    <X className="w-4 h-4 mr-2" />
                                    Reject
                                  </Button>
                                  <Button 
                                    onClick={() => handleApprove(application.id)}
                                    className="flex-1"
                                  >
                                    <Check className="w-4 h-4 mr-2" />
                                    Approve
                                  </Button>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        {application.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleReject(application.id)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleApprove(application.id)}
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                          </>
                        )}
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

export default CoolieVerification;