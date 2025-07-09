"use client";
import { LeaveData } from "@/lib/types";
import { useState } from 'react';

interface LeaveTableProps {
	leaveData: LeaveData[];
	currentMonth?: Date;
}

export function LeaveTable({ leaveData, currentMonth }: LeaveTableProps) {
	const [showAll, setShowAll] = useState(false);
	
	// Filter logic
	const dataToShow = currentMonth 
		? leaveData.filter(leave => {
				const year = currentMonth.getFullYear();
				const month = currentMonth.getMonth();
				const firstDay = new Date(year, month, 1);
				const lastDay = new Date(year, month + 1, 0);
				
				return (
					(leave.startDate >= firstDay && leave.startDate <= lastDay) ||
					(leave.endDate >= firstDay && leave.endDate <= lastDay) ||
					(leave.startDate <= firstDay && leave.endDate >= lastDay)
				);
			})
		: leaveData;
		
	const monthName = currentMonth?.toLocaleString('default', { month: 'long', year: 'numeric' });
	const displayData = showAll ? dataToShow : dataToShow.slice(0, 5);
	const hasMore = dataToShow.length > 5;

	return (
		<div className="bg-white shadow rounded-lg overflow-hidden">
			<div className="px-4 py-5 sm:px-6 border-b border-gray-200">
				<h3 className="text-lg leading-6 font-medium text-gray-900">
					Current Leave Status for {monthName || 'All Time'}
				</h3>
				{hasMore && (
					<p className="mt-1 text-sm text-gray-500">
						Showing {displayData.length} of {dataToShow.length} leaves
					</p>
				)}
			</div>
			
			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Employee
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Position
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Leave Dates
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Type
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Status
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{displayData.map((leave) => (
							<tr key={leave.id} className="hover:bg-gray-50">
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="flex items-center">
										<div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
											{leave.employee.charAt(0)}
										</div>
										<div className="ml-4">
											<div className="text-sm font-medium text-gray-900">
												{leave.employee}
											</div>
										</div>
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="text-sm text-gray-500">
										{leave.position}
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="text-sm text-gray-500">
										{leave.startDate.toLocaleDateString()} -{" "}
										{leave.endDate.toLocaleDateString()}
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="text-sm text-gray-500">
										{leave.type}
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<span
										className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
											leave.status === "Approved"
												? "bg-green-100 text-green-800"
												: leave.status === "Pending"
												? "bg-yellow-100 text-yellow-800"
												: "bg-red-100 text-red-800"
										}`}
									>
										{leave.status}
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{hasMore && (
				<div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
					<button
						onClick={() => setShowAll(!showAll)}
						className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						{showAll ? 'Show Less' : 'Show All'}
						{!showAll && (
							<span className="ml-2 bg-gray-200 text-gray-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
								+{dataToShow.length - 5}
							</span>
						)}
					</button>
				</div>
			)}
		</div>
	);
}