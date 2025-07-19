
import React from 'react';
import { RentalRequest } from '@/lib/database';

interface RentalRequestsListProps {
  requests: RentalRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const RentalRequestsList = ({ requests, onApprove, onReject }: RentalRequestsListProps) => {
  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Rental Requests</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">No rental requests yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Rental Requests</h3>
      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">{request.tenantName}</h4>
                <p className="text-sm text-gray-600">{request.tenantEmail}</p>
                <p className="text-sm text-gray-600">Property: {request.houseTitle}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                request.status === 'approved' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {request.status}
              </span>
            </div>
            
            {request.message && (
              <div className="mb-3">
                <p className="text-sm text-gray-700">{request.message}</p>
              </div>
            )}
            
            {request.status === 'pending' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => onApprove(request.id)}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => onReject(request.id)}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RentalRequestsList;
