"use client";
import { LeaveData } from "@/lib/types";
interface LeaveModalProps {
	leave: LeaveData | null;
	onClose: () => void;
}

export function LeaveModal({ leave, onClose }: LeaveModalProps) {
	if (!leave) return null;

	return (
		<div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg p-6 max-w-md w-full">
				<div className="flex justify-between items-start">
					<div>
						<h3 className="text-lg font-bold mb-2">{leave.employee}'s Leave</h3>
						<div className="flex items-center mb-4">
							<div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mr-3">
								{leave.employee.charAt(0)}
							</div>
							<div>
								<p className="text-sm text-gray-500">{leave.position}</p>
							</div>
						</div>
					</div>
					<span
						className={`px-2 py-1 rounded-full text-xs ${
							leave.status === "Approved" ? "bg-green-100 text-green-800" :
							leave.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
							"bg-red-100 text-red-800"
						}`}
					>
						{leave.status}
					</span>
				</div>

				<div className="space-y-3">
					<div>
						<p className="text-sm font-medium text-gray-500">Leave Type</p>
						<p className="text-gray-800">{leave.type}</p>
					</div>
					
					<div>
						<p className="text-sm font-medium text-gray-500">Dates</p>
						<p className="text-gray-800">
							{leave.startDate.toLocaleDateString()} - {leave.endDate.toLocaleDateString()}
						</p>
					</div>
					
					<div>
						<p className="text-sm font-medium text-gray-500">Duration</p>
						<p className="text-gray-800">
							{Math.ceil((leave.endDate.getTime() - leave.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1} days
						</p>
					</div>
				</div>

				<div className="mt-6 flex justify-end">
					<button 
						onClick={onClose}
						className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
}