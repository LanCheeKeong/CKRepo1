"use client";

import { LeaveData } from "@/lib/types";
import { format } from "date-fns";
import { forwardRef } from "react";

interface CalendarDateModalProps {
  isOpen: boolean;
  selectedDate: Date | null;
  selectedLeaves: LeaveData[];
  onClose: () => void;
  onSelectLeave: (leave: LeaveData, keepDateModalOpen?: boolean) => void;
}

export const CalendarDateModal = forwardRef<HTMLDivElement, CalendarDateModalProps>(
  ({ isOpen, selectedDate, selectedLeaves, onClose, onSelectLeave }, ref) => {
    if (!isOpen || !selectedDate) return null;

    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
				data-leave-modal>
        <div 
          ref={ref}
          className="bg-white max-w-full sm:max-w-md w-full rounded-lg shadow-lg p-3 sm:p-4 max-h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">
              Leaves on {format(selectedDate, "dd MMM yyyy")}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 text-xl"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {selectedLeaves.map((leave) => (
              <div
                key={leave.id}
                className={`text-sm p-3 rounded border cursor-pointer ${
                  leave.status === "Approved"
                    ? "bg-green-50 border-green-100 text-green-800"
                    : leave.status === "Pending"
                    ? "bg-yellow-50 border-yellow-100 text-yellow-800"
                    : "bg-red-50 border-red-100 text-red-800"
                }`}
                onClick={() => {
									onSelectLeave(leave, true);
								}}
              >
                <div className="font-medium">{leave.employee}</div>
                <div className="text-xs opacity-80">{leave.type}</div>
                <div className="text-xs mt-1">
                  {format(leave.startDate, "MMM d")} - {format(leave.endDate, "MMM d, yyyy")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

CalendarDateModal.displayName = "CalendarDateModal";