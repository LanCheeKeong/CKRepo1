"use client";

import { useState, useEffect, useRef } from "react";
import { LeaveData } from "@/lib/types";
import { format, isToday, isSameMonth } from "date-fns";
import { CalendarDateModal } from "@/app/calendar/calendarDateModal";
import { LeaveModal } from "@/app/calendar/calendarModal";

interface CalendarProps {
  currentMonth: Date;
  leaveData: LeaveData[];
  onSelectLeave: (leave: LeaveData) => void;
}

export function Calendar({ currentMonth, leaveData, onSelectLeave }: CalendarProps) {
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [selectedLeaves, setSelectedLeaves] = useState<LeaveData[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedLeave, setSelectedLeave] = useState<LeaveData | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const openDateModal = (date: Date, leaves: LeaveData[]) => {
    setSelectedLeaves(leaves);
    setSelectedDate(date);
    setDateModalOpen(true);
  };

  const closeDateModal = () => {
    setDateModalOpen(false);
    setSelectedLeaves([]);
    setSelectedDate(null);
  };

	const handleSelectLeave = (leave: LeaveData, keepDateModalOpen = false) => {
		setSelectedLeave(leave);
		if (!keepDateModalOpen) {
			closeDateModal();
		}
	};

  const closeLeaveModal = () => {
    setSelectedLeave(null);
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  return (
    <div className="bg-white rounded-b-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Sticky day names header */}
      <div className="grid grid-cols-7 sticky top-0 bg-white border-b">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 auto-rows-fr">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="min-h-[60px] sm:min-h-[80px] lg:min-h-[100px] border-r border-b border-gray-100"
          />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const currentDate = new Date(year, month, day);
          const leavesOnDay = leaveData.filter(
            (leave) =>
              currentDate >= leave.startDate && currentDate <= leave.endDate
          );
          const today = isToday(currentDate);
          const isCurrentMonth = isSameMonth(currentDate, currentMonth);
          const MAX_LEAVES_DISPLAY = 2;
          const leavesToShow = leavesOnDay.slice(0, MAX_LEAVES_DISPLAY);
          const hiddenLeavesCount = leavesOnDay.length - MAX_LEAVES_DISPLAY;

          return (
            <div
              key={`day-${day}`}
              className={`flex flex-col border-r border-b border-gray-100 ${
                today ? "bg-blue-50" : "bg-white"
              } ${!isCurrentMonth ? "opacity-50" : ""} ${
                leavesOnDay.length > 0 || today
                  ? "min-h-[100px] sm:min-h-[120px]"
                  : "min-h-[80px] sm:min-h-[100px]"
              }`}
            >
              <div className="flex justify-between items-center p-1 sm:p-2">
                <span
                  className={`text-xs sm:text-sm font-medium ${
                    today
                      ? "bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      : "text-gray-700"
                  }`}
                >
                  {day}
                </span>

                {leavesOnDay.length > 0 && (
                  <div className="flex items-center">
                    <span 
                      className="text-[10px] sm:text-xs text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
                      onClick={() => openDateModal(currentDate, leavesOnDay)}
                    >
                      <span className="hidden sm:inline">
                        {leavesOnDay.length} {leavesOnDay.length === 1 ? "leave" : "leaves"}
                      </span>
                      <span className="sm:hidden px-1 py-0.5 bg-blue-100 rounded-full text-blue-800">
                        {leavesOnDay.length}
                      </span>
                    </span>
                  </div>
                )}
              </div>

              <div className={`px-1 pb-1 space-y-1 overflow-y-auto h-auto`}>
                {leavesToShow.map((leave) => (
                  <div
										key={`leave-${leave.id}-${day}`}
										className={`text-xs sm:text-sm p-2 rounded cursor-pointer transition-colors ${
											leave.status === "Approved"
												? "bg-green-50 text-green-800 hover:bg-green-100 border border-green-100"
												: leave.status === "Pending"
												? "bg-yellow-50 text-yellow-800 hover:bg-yellow-100 border border-yellow-100"
												: "bg-red-50 text-red-800 hover:bg-red-100 border border-red-100"
										}`}
										onClick={() => {
											if (!dateModalOpen) {
												handleSelectLeave(leave); // This will close the date modal if it's open
											}
										}}
									>
                    <div className="font-medium truncate">{leave.employee}</div>
                    <div className="text-xs opacity-75 truncate">{leave.type}</div>
                  </div>
                ))}

                {hiddenLeavesCount > 0 && (
                  <div
                    className="text-[10px] sm:text-xs text-gray-600 italic cursor-pointer"
                    onClick={() => openDateModal(currentDate, leavesOnDay)}
                  >
                    +{hiddenLeavesCount} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Date Modal (shows all leaves for a date) */}
      <CalendarDateModal
        isOpen={dateModalOpen}
        selectedDate={selectedDate}
        selectedLeaves={selectedLeaves}
        onClose={closeDateModal}
        onSelectLeave={handleSelectLeave}
        ref={modalRef}
      />

      {/* Leave Modal (shows details for a single leave) */}
      <LeaveModal 
        leave={selectedLeave} 
        onClose={closeLeaveModal} 
      />
    </div>
  );
}