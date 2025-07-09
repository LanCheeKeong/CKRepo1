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
		<div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 bg-gray-50">
			<div className="flex flex-wrap items-center justify-between gap-4 sm:gap-6">
				{/* Month + Year Title */}
				<h2 className="text-xl sm:text-2xl font-bold text-gray-800">
					{currentMonth.toLocaleDateString("default", {
						month: "long",
						year: "numeric",
					})}
				</h2>

				{/* Right-side controls */}
				<div className="flex flex-wrap items-center gap-2">
					{/* Month + Year Select */}
					<select
						value={currentMonth.getMonth()}
						onChange={(e) =>
							onSetCurrentMonth(
								new Date(currentMonth.getFullYear(), parseInt(e.target.value), 1)
							)
						}
						className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 shadow-sm"
					>
						{Array.from({ length: 12 }).map((_, i) => (
							<option key={i} value={i}>
								{new Date(0, i).toLocaleString("default", { month: "long" })}
							</option>
						))}
					</select>

					<select
						value={currentMonth.getFullYear()}
						onChange={(e) =>
							onSetCurrentMonth(
								new Date(parseInt(e.target.value), currentMonth.getMonth(), 1)
							)
						}
						className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 shadow-sm"
					>
						{Array.from({ length: 5 }).map((_, i) => {
							const year = new Date().getFullYear() - 2 + i;
							return (
								<option key={year} value={year}>
									{year}
								</option>
							);
						})}
					</select>

					{/* Navigation Buttons */}
					<button
						onClick={() => onChangeMonth(-1)}
						className="p-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
						aria-label="Previous month"
					>
						<ChevronLeftIcon className="h-5 w-5" />
					</button>

					<button
						onClick={() => onSetCurrentMonth(new Date())}
						className="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
					>
						Today
					</button>

					<button
						onClick={() => onChangeMonth(1)}
						className="p-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
						aria-label="Next month"
					>
						<ChevronRightIcon className="h-5 w-5" />
					</button>
				</div>
			</div>
		</div>
	);
}