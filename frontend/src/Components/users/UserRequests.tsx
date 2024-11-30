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
// import axiosInstance from '@/utils/axios';

interface UserRequest {
  id: string;
  userId: string;
  email: string;
  requestType: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  createdAt: string;
}

// Dummy data
const dummyRequests: UserRequest[] = [
  {
    id: '1',
    userId: 'user1',
    email: 'john.doe@example.com',
    requestType: 'Access Request',
    status: 'pending',
    message: 'Requesting access to the machine learning models for research purposes.',
    createdAt: '2024-11-25T10:30:00Z'
  },
  {
    id: '2',
    userId: 'user2',
    email: 'jane.smith@example.com',
    requestType: 'Model Extension',
    status: 'approved',
    message: 'Need extended access to Model XYZ for the next quarter.',
    createdAt: '2024-11-24T15:45:00Z'
  },
  {
    id: '3',
    userId: 'user3',
    email: 'bob.wilson@example.com',
    requestType: 'New Model Access',
    status: 'rejected',
    message: 'Requesting access to the new GPT-5 model.',
    createdAt: '2024-11-23T09:15:00Z'
  },
  {
    id: '4',
    userId: 'user4',
    email: 'alice.johnson@example.com',
    requestType: 'Access Request',
    status: 'pending',
    message: 'Need access for a new research project starting next month.',
    createdAt: '2024-11-22T14:20:00Z'
  }
];

export const UserRequests = () => {
  const [requests, setRequests] = useState<UserRequest[]>(dummyRequests);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<UserRequest | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // Commented out the actual API fetch
  /*
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axiosInstance.get('/user-requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };
  */

  const handleStatusChange = async (requestId: string, newStatus: 'approved' | 'rejected') => {
    // Simulating API call with local state update
    /*
    try {
      await axiosInstance.patch(`/user-requests/${requestId}`, {
        status: newStatus
      });
      await fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error updating request status:', error);
    }
    */
    
    // Update local state instead
    setRequests(requests.map(request => 
      request.id === requestId 
        ? { ...request, status: newStatus }
        : request
    ));
    setIsDetailsDialogOpen(false);
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

  const filteredRequests = requests.filter(request =>
    request.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.requestType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Requests</h1>
      
      <div className="mb-6">
        <Input
          placeholder="Search by email or request type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Request Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRequests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.email}</TableCell>
              <TableCell>{request.requestType}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(request.status)}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Email</h3>
                <p>{selectedRequest.email}</p>
              </div>
              <div>
                <h3 className="font-medium">Request Type</h3>
                <p>{selectedRequest.requestType}</p>
              </div>
              <div>
                <h3 className="font-medium">Message</h3>
                <p className="whitespace-pre-wrap">{selectedRequest.message}</p>
              </div>
              <div>
                <h3 className="font-medium">Status</h3>
                <Badge className={getStatusColor(selectedRequest.status)}>
                  {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                </Badge>
              </div>
            </div>
          )}
          <DialogFooter className="space-x-2">
            {selectedRequest?.status === 'pending' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange(selectedRequest.id, 'rejected')}
                  className="bg-red-100 hover:bg-red-200 text-red-800"
                >
                  Reject
                </Button>
                <Button
                  onClick={() => handleStatusChange(selectedRequest.id, 'approved')}
                  className="bg-green-100 hover:bg-green-200 text-green-800"
                >
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserRequests;