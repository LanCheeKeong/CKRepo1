"use client";
import { FaSearch, FaPlus, FaSync } from "react-icons/fa";

interface SearchFormProps {
	searchParams: {
		employee_id: string;
		full_name: string;
		ic: string;
		department_id: string;
		status: string;
	};
	isLoading: boolean;
	onSearchChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
	onSearchSubmit: (e: React.FormEvent) => void;
	onReset: () => void;
	onAddEmployee: () => void;
}

export default function EmployeeSearchForm({
	searchParams,
	isLoading,
	onSearchChange,
	onSearchSubmit,
	onReset,
	onAddEmployee,
}: SearchFormProps) {
	return (
		<form onSubmit={onSearchSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
					<input
						type="number"
						name="employee_id"
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						value={searchParams.employee_id}
						onChange={onSearchChange}
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
					<input
						type="text"
						name="full_name"
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						value={searchParams.full_name}
						onChange={onSearchChange}
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">IC Number</label>
					<input
						type="text"
						name="ic"
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						value={searchParams.ic}
						onChange={onSearchChange}
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
					<select
						name="status"
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						value={searchParams.status}
						onChange={onSearchChange}
					>
						<option value="">All</option>
						<option value="A">Active</option>
						<option value="I">Inactive</option>
					</select>
				</div>
			</div>
			<div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition flex items-center justify-center"
        >
          <FaSync className="mr-2" />
          Reset
        </button>
        <button
          type="button"
          onClick={onAddEmployee}
          className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center justify-center"
        >
          <FaPlus className="mr-2" />
          Add Employee
        </button>
      </div>
      <button
        type="submit"
        className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center"
        disabled={isLoading}
      >
        <FaSearch className="mr-2" />
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </div>
		</form>
	);
}