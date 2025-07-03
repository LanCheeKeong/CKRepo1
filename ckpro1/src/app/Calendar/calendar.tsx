"use client";
import { LeaveData } from "@/lib/types";

interface CalendarProps {
	currentMonth: Date;
	leaveData: LeaveData[];
	onSelectLeave: (leave: LeaveData) => void;
}

export function Calendar({ currentMonth, leaveData, onSelectLeave }: CalendarProps) {
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
		<div className="bg-white shadow rounded-lg overflow-hidden">
			{/* Sticky day names header */}
			<div className="grid grid-cols-7 gap-px bg-gray-200 border-b sticky top-0 z-10">
				{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
					<div
						key={day}
						className="bg-gray-100 py-3 text-center text-xs font-semibold text-gray-600"
					>
						{day}
					</div>
				))}
			</div>

			{/* Calendar grid */}
			<div className="grid grid-cols-7 gap-px bg-gray-200">
				{Array.from({ length: firstDay }).map((_, i) => (
					<div key={`empty-${i}`} className="min-h-[120px] bg-gray-50"></div>
				))}

				{Array.from({ length: daysInMonth }).map((_, i) => {
					const day = i + 1;
					const currentDate = new Date(year, month, day);
					const leavesOnDay = leaveData.filter(
						(leave) =>
							currentDate >= leave.startDate && currentDate <= leave.endDate
					);
					const isToday =
						day === new Date().getDate() &&
						month === new Date().getMonth() &&
						year === new Date().getFullYear();

					return (
						<div
							key={`day-${day}`}
							className={`min-h-[120px] bg-white flex flex-col ${
								isToday ? "ring-1 ring-blue-500" : ""
							}`}
						>
							<div className="flex justify-between items-center p-1 border-b">
								<span
									className={`text-sm font-medium ${
										isToday ? "text-blue-600 font-bold" : "text-gray-700"
									}`}
								>
									{day}
								</span>
								{isToday && (
									<span className="h-2 w-2 rounded-full bg-blue-500"></span>
								)}
							</div>
							
							<div className="flex-1 overflow-y-auto max-h-[100px] p-1">
								{leavesOnDay.length > 0 ? (
									<div className="space-y-1">
										{leavesOnDay.map((leave) => (
											<div
												key={`leave-${leave.id}-${day}`}
												className={`text-xs p-1 rounded truncate cursor-pointer ${
													leave.status === "Approved"
														? "bg-green-100 text-green-800 hover:bg-green-200"
														: leave.status === "Pending"
														? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
														: "bg-red-100 text-red-800 hover:bg-red-200"
												}`}
												title={`${leave.employee} - ${leave.type} (${leave.status})`}
												onClick={() => onSelectLeave(leave)}
											>
												<span className="font-medium">{leave.employee}</span>
												<span className="block text-xxs opacity-75 truncate">
													{leave.type}
												</span>
											</div>
										))}
									</div>
								) : (
									<div className="text-gray-400 text-xs text-center py-2">
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}