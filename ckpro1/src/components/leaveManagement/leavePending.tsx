"use client";
import { useState } from "react";

type Request = {
  id: number;
  name: string;
  type: string;
  dates: string;
  status: "pending" | "approved" | "rejected";
};

export default function PendingRequests() {
  const [requests, setRequests] = useState<Request[]>([
    { id: 1, name: "John Doe", type: "Annual Leave", dates: "2023-10-01 to 2023-10-03", status: "pending" },
    { id: 2, name: "Jane Smith", type: "Sick Leave", dates: "2023-10-05", status: "pending" },
  ]);

  const handleApprove = (id: number) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: "approved" } : req
    ));
  };

  const handleReject = (id: number) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: "rejected" } : req
    ));
  };

  return (
    <div className="space-y-3">
      {requests.filter(req => req.status === "pending").map((request) => (
        <div key={request.id} className="p-3 border rounded-lg">
          <div className="flex justify-between">
            <div>
              <p className="font-medium">{request.name}</p>
              <p className="text-sm text-gray-600">{request.type} • {request.dates}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleApprove(request.id)}
                className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(request.id)}
                className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}