"use client";
import { useState, useEffect } from "react";
import { Calendar } from "@/app/calendar/calendar";
import { CalendarControls } from "@/app/calendar/calendarControl";
import { LeaveTable } from "@/app/leavesTable/leaveTable";
import { LeaveModal } from "@/app/calendar/calendarModal";
import { LeaveData } from "@/lib/types";

export default function Dashboard() {
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [allLeaveData, setAllLeaveData] = useState<LeaveData[]>([]);
	const [filteredLeaveData, setFilteredLeaveData] = useState<LeaveData[]>([]);
	const [selectedLeave, setSelectedLeave] = useState<LeaveData | null>(null);

	// Filter leaves based on current month
	useEffect(() => {
		const currentYear = currentMonth.getFullYear();
		const currentMonthIndex = currentMonth.getMonth();
		
		const filtered = allLeaveData.filter(leave => {
			const leaveStart = leave.startDate;
			const leaveEnd = leave.endDate;
			const monthStart = new Date(currentYear, currentMonthIndex, 1);
			const monthEnd = new Date(currentYear, currentMonthIndex + 1, 0);

			return (
				// Leave starts in current month
				(leaveStart.getFullYear() === currentYear && 
				leaveStart.getMonth() === currentMonthIndex) ||
				// Leave ends in current month
				(leaveEnd.getFullYear() === currentYear && 
				leaveEnd.getMonth() === currentMonthIndex) ||
				// Leave spans across current month
				(leaveStart < monthStart && leaveEnd > monthEnd)
			);
		});
		
		setFilteredLeaveData(filtered);
	}, [allLeaveData, currentMonth]);

	// Sample leave data
	useEffect(() => {
		const sampleData: LeaveData[] = [
			{
				id: 1,
				employee: "John Doe",
				position: "Developer",
				startDate: new Date(2025, 6, 10),
				endDate: new Date(2025, 6, 15),
				type: "Vacation",
				status: "Approved",
			},
			{
				id: 2,
				employee: "Jane Smith",
				position: "Designer",
				startDate: new Date(2025, 6, 12),
				endDate: new Date(2025, 6, 14),
				type: "Sick Leave",
				status: "Approved",
			},
			{
				id: 3,
				employee: "Robert Johnson",
				position: "Manager",
				startDate: new Date(2025, 6, 18),
				endDate: new Date(2025, 6, 20),
				type: "Personal",
				status: "Pending",
			},
			{
				id: 4,
				employee: "Emily Davis",
				position: "HR Specialist",
				startDate: new Date(2025, 6, 22),
				endDate: new Date(2025, 6, 25),
				type: "Vacation",
				status: "Rejected",
			},
			{
				id: 5,
				employee: "Jonnny Davis",
				position: "Barista",
				startDate: new Date(2025, 6, 22),
				endDate: new Date(2025, 6, 25),
				type: "Vacation",
				status: "Approved",
			},
			{
				id: 6,
				employee: "Mariah",
				position: "Barista",
				startDate: new Date(2025, 6, 22),
				endDate: new Date(2025, 6, 25),
				type: "Vacation",
				status: "Rejected",
			},
			{
				id: 7,
				employee: "Alex",
				position: "Barista",
				startDate: new Date(2025, 6, 22),
				endDate: new Date(2025, 6, 25),
				type: "Vacation",
				status: "Approved",
			},
			{
				id: 8,
				employee: "Liew",
				position: "Barista",
				startDate: new Date(2025, 6, 22),
				endDate: new Date(2025, 6, 25),
				type: "Vacation",
				status: "Approved",
			},
			{
				id: 9,
				employee: "John Doe",
				position: "Developer",
				startDate: new Date(2025, 6, 20),
				endDate: new Date(2025, 6, 21),
				type: "Sick Leave",
				status: "Approved",
			},
		];
		setAllLeaveData(sampleData);
	}, []);

	const changeMonth = (increment: number) => {
		setCurrentMonth(
			new Date(currentMonth.getFullYear(), currentMonth.getMonth() + increment, 1)
		);
	};

	return (
		<>
		<div className="pb-1">
			<div className="mb-4 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				<CalendarControls
					currentMonth={currentMonth}
					onChangeMonth={changeMonth}
					onSetCurrentMonth={setCurrentMonth}
				/>
				<Calendar
					currentMonth={currentMonth}
					leaveData={filteredLeaveData}
					onSelectLeave={setSelectedLeave}
				/>
			</div>
			<div className="mb-4 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				<LeaveTable leaveData={allLeaveData} currentMonth={currentMonth} />
				<LeaveModal leave={selectedLeave} onClose={() => setSelectedLeave(null)} 
				/>
			</div>
		</div>
		</>
	);
}