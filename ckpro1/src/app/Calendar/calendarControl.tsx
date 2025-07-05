"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface CalendarControlsProps {
	currentMonth: Date;
	onChangeMonth: (increment: number) => void;
	onSetCurrentMonth: (date: Date) => void;
}

export function CalendarControls({
	currentMonth,
	onChangeMonth,
	onSetCurrentMonth,
}: CalendarControlsProps) {
	return (
		<div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
			<h2 className="text-2xl font-bold text-gray-800">
				{currentMonth.toLocaleDateString("default", {
					month: "long",
					year: "numeric",
				})}
			</h2>
			
			<div className="flex items-center gap-2">
				<div className="flex items-center gap-1">
					<select
						value={currentMonth.getMonth()}
						onChange={(e) => onSetCurrentMonth(
							new Date(currentMonth.getFullYear(), parseInt(e.target.value), 1)
						)}
						className="px-3 py-1 border rounded-md text-sm"
					>
						{Array.from({ length: 12 }).map((_, i) => (
							<option key={i} value={i}>
								{new Date(0, i).toLocaleString('default', { month: 'long' })}
							</option>
						))}
					</select>
					<select
						value={currentMonth.getFullYear()}
						onChange={(e) => onSetCurrentMonth(
							new Date(parseInt(e.target.value), currentMonth.getMonth(), 1)
						)}
						className="px-3 py-1 border rounded-md text-sm"
					>
						{Array.from({ length: 5 }).map((_, i) => {
							const year = new Date().getFullYear() - 2 + i;
							return <option key={year} value={year}>{year}</option>;
						})}
					</select>
				</div>
				
				<div className="flex space-x-2">
					<button
						onClick={() => onChangeMonth(-1)}
						className="p-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
					>
						<ChevronLeftIcon className="h-5 w-5" />
					</button>
					<button
						onClick={() => onSetCurrentMonth(new Date())}
						className="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
					>
						Today
					</button>
					<button
						onClick={() => onChangeMonth(1)}
						className="p-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
					>
						<ChevronRightIcon className="h-5 w-5" />
					</button>
				</div>
			</div>
		</div>
	);
}