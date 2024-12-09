import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/Components/ui/dialog';
import { Badge } from '@/Components/ui/badge';
import axiosInstance from '@/utils/axios';

interface UserRequest {
  id: string;
  name: string;
  email: string;
  requestType: 'CONTACT';
  status?: 'pending' | 'approved' | 'rejected';
  message: string;
  createdAt: string;
}

export const UserRequests = () => {
  const [requests, setRequests] = useState<UserRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<UserRequest | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isDenyDialogOpen, setIsDenyDialogOpen] = useState(false);
  const defaultStatus = 'pending';

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axiosInstance.get<UserRequest[]>('/account-requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      alert('Failed to fetch requests.');
    }
  };

  const handleStatusChange = async (requestId: string, newStatus: 'approved' | 'rejected') => {
    try {
      if (newStatus === 'rejected') {
        // Call the deny API
        await axiosInstance.post(`/account-requests/deny`, {
          key: requestId,
          value: "Request denied by admin",
        });
        
        // Remove the denied request from the state
        setRequests((prevRequests) => 
          prevRequests.filter((request) => request.id !== requestId)
        );
      } else {
        // Handle approval
        await axiosInstance.post(`/account-requests/approve`, {
          key: requestId,
          value: "temporaryPassword123",
        });
        await fetchRequests();
      }

      // Close all dialogs
      setIsApproveDialogOpen(false);
      setIsDenyDialogOpen(false);
      setIsDetailsDialogOpen(false);
    } catch (error: any) {
      console.error('Error response:', error.response?.data || error.message);
      alert('Failed to update request status. Check console for details.');
    }
  };

  const handleApproveRequest = (request: UserRequest) => {
    setSelectedRequest(request);
    setIsApproveDialogOpen(true);
  };

  const handleDenyRequest = (request: UserRequest) => {
    setSelectedRequest(request);
    setIsDenyDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const filteredRequests = requests.filter((request) =>
    request.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (request.name && request.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Requests</h1>
      
      <div className="mb-6">
        <Input
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRequests.map((request) => {
            const currentStatus = request.status || defaultStatus;
            return (
              <TableRow key={request.id}>
                <TableCell>{request.name || 'N/A'}</TableCell>
                <TableCell>{request.email}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(currentStatus)}>
                    {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'Invalid Date'}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedRequest(request);
                      setIsDetailsDialogOpen(true);
                    }}
                  >
                    View Details
                  </Button>
                  {currentStatus === defaultStatus && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApproveRequest(request)}
                        className="bg-green-100 hover:bg-green-200 text-green-800"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDenyRequest(request)}
                        className="bg-red-100 hover:bg-red-200 text-red-800"
                      >
                        Deny
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Name</h3>
                <p>{selectedRequest.name || 'N/A'}</p>
              </div>
              <div>
                <h3 className="font-medium">Email</h3>
                <p>{selectedRequest.email}</p>
              </div>
              <div>
                <h3 className="font-medium">Message</h3>
                <p className="whitespace-pre-wrap">{selectedRequest.message}</p>
              </div>
              <div>
                <h3 className="font-medium">Status</h3>
                <Badge className={getStatusColor(selectedRequest.status || defaultStatus)}>
                  {(selectedRequest.status || defaultStatus).charAt(0).toUpperCase() +
                    (selectedRequest.status || defaultStatus).slice(1)}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Request</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to approve the request from {selectedRequest?.name || 'N/A'}?</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsApproveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => selectedRequest && handleStatusChange(selectedRequest.id, 'approved')}
              className="bg-green-100 hover:bg-green-200 text-green-800"
            >
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deny Dialog */}
      <Dialog open={isDenyDialogOpen} onOpenChange={setIsDenyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deny Request</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to deny the request from {selectedRequest?.name || 'N/A'}?</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDenyDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => selectedRequest && handleStatusChange(selectedRequest.id, 'rejected')}
              className="bg-red-100 hover:bg-red-200 text-red-800"
            >
              Deny
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserRequests;