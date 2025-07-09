"use client";
import { useState } from "react";

export default function LeaveApplyForm() {
	const [leaveData, setLeaveData] = useState({
		type: "annual",
		startDate: "",
		endDate: "",
		reason: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Leave submitted:", leaveData);
		// API call to submit leave
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label className="block text-sm font-medium mb-1">Leave Type</label>
				<select
					value={leaveData.type}
					onChange={(e) => setLeaveData({ ...leaveData, type: e.target.value })}
					className="w-full p-2 border rounded"
				>
					<option value="annual">Annual Leave</option>
					<option value="sick">Sick Leave</option>
					<option value="unpaid">Unpaid Leave</option>
				</select>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium mb-1">Start Date</label>
					<input
						type="date"
						value={leaveData.startDate}
						onChange={(e) => setLeaveData({ ...leaveData, startDate: e.target.value })}
						className="w-full p-2 border rounded"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium mb-1">End Date</label>
					<input
						type="date"
						value={leaveData.endDate}
						onChange={(e) => setLeaveData({ ...leaveData, endDate: e.target.value })}
						className="w-full p-2 border rounded"
					/>
				</div>
			</div>

			<div>
				<label className="block text-sm font-medium mb-1">Reason</label>
				<textarea
					value={leaveData.reason}
					onChange={(e) => setLeaveData({ ...leaveData, reason: e.target.value })}
					className="w-full p-2 border rounded"
					rows={3}
				/>
			</div>

			<button
				type="submit"
				className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
			>
				Submit Request
			</button>
		</form>
	);
}