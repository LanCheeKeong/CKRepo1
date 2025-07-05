"use client";
import { useState, useEffect, useRef } from 'react';
import type { Employee } from '@/lib/types';
import { useRouter, useParams } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Reusable Section Component
const Section = ({ 
	title, 
	children, 
	className = '' 
}: {
	title: string;
	children: React.ReactNode;
	className?: string;
}) => (
	<div className={`border-b border-gray-200 pb-6 mb-6 ${className}`}>
		<h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
		{children}
	</div>
);

// Enhanced Input Component with ref support
const Input = ({ 
	label, 
	name, 
	value, 
	onChange, 
	type = "text", 
	required = false, 
	className = '', 
	error, 
	disabled = false,
	placeholder = '',
	min,
	max,
	step,
	forwardRef
}: {
	label: string;
	name: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
	type?: string;
	required?: boolean;
	className?: string;
	error?: string;
	disabled?: boolean;
	placeholder?: string;
	min?: number | string;
	max?: number | string;
	step?: number | string;
	forwardRef?: (el: HTMLInputElement | null) => void;
}) => (
	<div className={`mb-4 ${className}`}>
		<label className="block text-sm font-medium text-gray-700 mb-1">
			{label}
			{required && <span className="text-red-500 ml-1">*</span>}
		</label>
		<input
			ref={forwardRef}
			type={type}
			name={name}
			value={value}
			onChange={onChange}
			required={required}
			disabled={disabled}
			placeholder={placeholder}
			min={min}
			max={max}
			step={step}
			className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
		/>
		{error && <p className="mt-1 text-sm text-red-600">{error}</p>}
	</div>
);

// Enhanced Select Component with ref support
const Select = ({ 
	label, 
	name, 
	value, 
	onChange, 
	options, 
	required = false, 
	className = '', 
	error,
	disabled = false,
	forwardRef
}: {
	label: string;
	name: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	options: { value: string; label: string }[];
	required?: boolean;
	className?: string;
	error?: string;
	disabled?: boolean;
	forwardRef?: (el: HTMLSelectElement | null) => void;
}) => (
	<div className={`mb-4 ${className}`}>
		<label className="block text-sm font-medium text-gray-700 mb-1">
			{label}
			{required && <span className="text-red-500 ml-1">*</span>}
		</label>
		<select
			ref={forwardRef}
			name={name}
			value={value}
			onChange={onChange}
			required={required}
			disabled={disabled}
			className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
		>
			<option value="">Select</option>
			{options.map((opt) => (
				<option key={opt.value} value={opt.value}>
					{opt.label}
				</option>
			))}
		</select>
		{error && <p className="mt-1 text-sm text-red-600">{error}</p>}
	</div>
);

export default function EmployeeEdit() {
	const [employee, setEmployee] = useState<Employee | null>(null);
	const [editForm, setEditForm] = useState<Partial<Employee>>({});
	const [departments, setDepartments] = useState<{value: string; label: string}[]>([]);
	const [isLoading, setIsLoading] = useState({
		page: true,
		submit: false,
		departments: false
	});
	const [formErrors, setFormErrors] = useState<Record<string, string>>({});
	const router = useRouter();
	const params = useParams();
	const id = params?.id;
	const inputRefs = useRef<Record<string, HTMLInputElement | HTMLSelectElement | null>>({});

	useEffect(() => {
		fetchEmployee();
		return () => {
			// Clear refs on unmount
			Object.keys(inputRefs.current).forEach(key => {
				inputRefs.current[key] = null;
			});
		};
	}, [id]);

	const fetchEmployee = async () => {
		setIsLoading(prev => ({...prev, page: true}));
		try {
			const res = await fetch(`/api/employees/${id}`);
			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error || 'Failed to fetch employee');
			}
			const data = await res.json();
			setEmployee(data);
			setEditForm({
				...data,
				basic_salary: data.basic_salary?.toString() || '',
				epf_percent: data.epf_percent?.toString() || '',
				socso_percent: data.socso_percent?.toString() || '',
				tax_percent: data.tax_percent?.toString() || ''
			});
		} catch (error) {
			console.error('Failed to fetch employee details', error);
			toast.error(error.message || 'Failed to load employee data');
			router.push('/employees');
		} finally {
			setIsLoading(prev => ({...prev, page: false}));
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		
		setEditForm(prev => ({
			...prev,
			[name]: value
		}));
		
		if (formErrors[name]) {
			setFormErrors(prev => {
				const newErrors = {...prev};
				delete newErrors[name];
				return newErrors;
			});
		}
	};

	const validateForm = () => {
		const errors: Record<string, string> = {};
		
		// Required fields
		if (!editForm.full_name?.trim()) errors.full_name = 'Full name is required';
		if (!editForm.status) errors.status = 'Status is required';
		
		// Format validations
		if (editForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
			errors.email = 'Invalid email format';
		}
		
		if (editForm.ic && !/^\d{6}-\d{2}-\d{4}$/.test(editForm.ic)) {
			errors.ic = 'IC format should be XXXXXX-XX-XXXX';
		}

		// Number validations
		const numberFields = [
			{ name: 'basic_salary', label: 'Basic Salary', min: 0, max: 999999 },
			{ name: 'epf_percent', label: 'EPF Percentage', min: 0, max: 20 },
			{ name: 'socso_percent', label: 'SOCSO Percentage', min: 0, max: 5 },
			{ name: 'tax_percent', label: 'Tax Percentage', min: 0, max: 30 }
		];

		numberFields.forEach(field => {
			const value = editForm[field.name as keyof typeof editForm];
			if (value && value.toString().trim() !== '') {
				const numValue = Number(value);
				if (isNaN(numValue)) {
					errors[field.name] = `${field.label} must be a number`;
				} else if (numValue < field.min) {
					errors[field.name] = `${field.label} cannot be less than ${field.min}`;
				} else if (numValue > field.max) {
					errors[field.name] = `${field.label} cannot exceed ${field.max}`;
				}
			}
		});

		setFormErrors(errors);
		
		if (Object.keys(errors).length > 0) {
			const firstErrorField = Object.keys(errors)[0];
			if (inputRefs.current[firstErrorField]) {
				inputRefs.current[firstErrorField]?.focus();
				inputRefs.current[firstErrorField]?.scrollIntoView({
					behavior: 'smooth',
					block: 'center'
				});
			}
			
			toast.error(`Please fix the error in ${firstErrorField.replace('_', ' ')}`, {
				position: 'top-center'
			});
			
			return false;
		}
		
		return true;
	};

	const handleUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!employee || !validateForm()) return;
		
		if (editForm.status === 'I' && employee.status === 'A') {
			const confirm = window.confirm(
				'Are you sure you want to deactivate this employee?'
			);
			if (!confirm) return;
		}

		setIsLoading(prev => ({...prev, submit: true}));
		try {
			const res = await fetch(`/api/employees/${employee.employee_id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...editForm,
					basic_salary: editForm.basic_salary ? Number(editForm.basic_salary) : null,
					epf_percent: editForm.epf_percent ? Number(editForm.epf_percent) : null,
					socso_percent: editForm.socso_percent ? Number(editForm.socso_percent) : null,
					tax_percent: editForm.tax_percent ? Number(editForm.tax_percent) : null,
				}),
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error || 'Update failed');
			}

			const updatedEmployee = await res.json();
			toast.success('Employee updated successfully!');
			
			setEmployee(updatedEmployee);
			setEditForm({
				...updatedEmployee,
				basic_salary: updatedEmployee.basic_salary?.toString() || '',
				epf_percent: updatedEmployee.epf_percent?.toString() || '',
				socso_percent: updatedEmployee.socso_percent?.toString() || '',
				tax_percent: updatedEmployee.tax_percent?.toString() || ''
			});
		} catch (error) {
			console.error('Update failed:', error);
			toast.error(error.message || 'Failed to update employee');
		} finally {
			setIsLoading(prev => ({...prev, submit: false}));
		}
	};

	const handleBackToSearch = () => {
		router.push('/employees');
	};

	if (isLoading.page && !employee) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="p-8 text-center text-gray-500">
					<svg className="animate-spin mx-auto h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
						<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					<p className="mt-2">Loading employee data...</p>
				</div>
			</div>
		);
	}

	if (!employee) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="p-8 text-center text-gray-500">
					<svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<p className="mt-2">Employee not found</p>
					<button
						onClick={handleBackToSearch}
						className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
					>
						Back to Employee List
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<ToastContainer 
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
			
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
				<div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
					<button
						onClick={handleBackToSearch}
						className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 transition"
					>
						<svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
						</svg>
						Back to Search
					</button>
					<h2 className="text-lg font-semibold text-gray-800">
						Editing: {employee.full_name} ({employee.employee_id})
					</h2>
				</div>
				
				<form onSubmit={handleUpdate} className="p-6">
					<Section title="Personal Information">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<Input 
								label="Full Name" 
								name="full_name" 
								value={editForm.full_name || ''} 
								onChange={handleInputChange} 
								required 
								error={formErrors.full_name}
								placeholder="John Doe"
								forwardRef={(el) => (inputRefs.current['full_name'] = el)}
							/>
							<Input 
								label="Email" 
								name="email" 
								type="email" 
								value={editForm.email || ''} 
								onChange={handleInputChange}
								error={formErrors.email}
								placeholder="john.doe@example.com"
								forwardRef={(el) => (inputRefs.current['email'] = el)}
							/>
							<Input 
								label="IC Number" 
								name="ic" 
								value={editForm.ic || ''} 
								onChange={handleInputChange}
								error={formErrors.ic}
								placeholder="XXXXXX-XX-XXXX"
								forwardRef={(el) => (inputRefs.current['ic'] = el)}
							/>
							<Input 
								label="Phone" 
								name="phone" 
								value={editForm.phone || ''} 
								onChange={handleInputChange}
								placeholder="+60 12-345 6789"
								forwardRef={(el) => (inputRefs.current['phone'] = el)}
							/>
							<Select 
								label="Gender" 
								name="gender" 
								value={editForm.gender || ''} 
								onChange={handleInputChange}
								options={[
									{ value: "Male", label: "Male" },
									{ value: "Female", label: "Female" },
									{ value: "Other", label: "Other" }
								]} 
								forwardRef={(el) => (inputRefs.current['gender'] = el)}
							/>
							<Input 
								label="Date of Birth" 
								name="date_of_birth" 
								type="date" 
								value={editForm.date_of_birth || ''} 
								onChange={handleInputChange}
								forwardRef={(el) => (inputRefs.current['date_of_birth'] = el)}
							/>
						</div>
					</Section>
					
					<Section title="Security Information">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<Input 
								label="Password"
								name="password"
								type="password"
								value={editForm.password || ''}
								onChange={handleInputChange}
								required
								error={formErrors.password}
								placeholder="Abc123!@#"
							/>
							<Input 
								label="Confirm Password"
								name="confirmPassword"
								type="password"
								value={editForm.confirmPassword || ''}
								onChange={handleInputChange}
								required
								error={formErrors.confirmPassword}
								placeholder="Re-enter your password"
							/>
						</div>
					</Section>
				
					<Section title="Employment Details">
						<div className="grid grid-cols-3 gap-6"> {/* 3 columns */}
							<Select 
								label="Status" 
								name="status" 
								value={editForm.status || ''} 
								onChange={handleInputChange}
								options={[
									{ value: "A", label: "Active" },
									{ value: "I", label: "Inactive" }
								]} 
								required 
								error={formErrors.status}
								forwardRef={(el) => (inputRefs.current['status'] = el)}
							/>
							<Select 
								label="Role" 
								name="role" 
								value={editForm.role || ''} 
								onChange={handleInputChange}
								options={[
									{ value: "Admin", label: "Admin" },
									{ value: "Manager", label: "Manager" },
									{ value: "Employee", label: "Employee" }
								]} 
								forwardRef={(el) => (inputRefs.current['role'] = el)}
							/>
							<Input 
								label="Basic Salary" 
								name="basic_salary" 
								type="number" 
								value={editForm.basic_salary?.toString() || ''} 
								onChange={handleInputChange}
								placeholder="5000.00"
								min="0"
								step="0.01"
								error={formErrors.basic_salary}
								forwardRef={(el) => (inputRefs.current['basic_salary'] = el)}
							/>
							<Input 
								label="Join Date" 
								name="join_date" 
								type="date" 
								value={editForm.join_date || ''} 
								onChange={handleInputChange}
								forwardRef={(el) => (inputRefs.current['join_date'] = el)}
							/>
							<Input 
								label="Position" 
								name="position" 
								value={editForm.position || ''} 
								onChange={handleInputChange}
								placeholder="Software Engineer"
								forwardRef={(el) => (inputRefs.current['position'] = el)}
							/>
							<Select 
								label="Department" 
								name="department_id" 
								value={editForm.department_id?.toString() || ''} 
								onChange={handleInputChange}
								options={departments}
								disabled={isLoading.departments}
								forwardRef={(el) => (inputRefs.current['department_id'] = el)}
							/>
						</div>
					</Section>

					<Section title="Statutory Information">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<Input 
								label="EPF Number" 
								name="epf_number" 
								value={editForm.epf_number?.toString() || ''} 
								onChange={handleInputChange}
								placeholder="A12345678"
								forwardRef={(el) => (inputRefs.current['epf_number'] = el)}
							/>
							<Input 
								label="EPF Percentage" 
								name="epf_percent" 
								type="number" 
								value={editForm.epf_percent?.toString() || ''} 
								onChange={handleInputChange}
								placeholder="11"
								min="0"
								max="20"
								step="0.1"
								error={formErrors.epf_percent}
								forwardRef={(el) => (inputRefs.current['epf_percent'] = el)}
							/>
							<Input 
								label="SOCSO Number" 
								name="socso_number" 
								value={editForm.socso_number?.toString() || ''} 
								onChange={handleInputChange}
								placeholder="1234567890"
								forwardRef={(el) => (inputRefs.current['socso_number'] = el)}
							/>
							<Input 
								label="SOCSO Percentage" 
								name="socso_percent" 
								type="number" 
								value={editForm.socso_percent?.toString() || ''} 
								onChange={handleInputChange}
								placeholder="0.5"
								min="0"
								max="5"
								step="0.1"
								error={formErrors.socso_percent}
								forwardRef={(el) => (inputRefs.current['socso_percent'] = el)}
							/>
							<Input 
								label="Tax Percentage" 
								name="tax_percent" 
								type="number" 
								value={editForm.tax_percent?.toString() || ''} 
								onChange={handleInputChange}
								placeholder="10"
								min="0"
								max="30"
								step="0.1"
								error={formErrors.tax_percent}
								forwardRef={(el) => (inputRefs.current['tax_percent'] = el)}
							/>
						</div>
					</Section>

					<Section title="Audit Information" className="bg-gray-50 p-4 rounded-lg">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
								<div className="w-full px-3 py-2 bg-gray-100 rounded-md">
									{editForm.created_by || 'N/A'}
								</div>
							</div>
							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
								<div className="w-full px-3 py-2 bg-gray-100 rounded-md">
									{editForm.created_at ? new Date(editForm.created_at).toLocaleString() : 'N/A'}
								</div>
							</div>
							{editForm.updated_by && (
								<div className="mb-4">
									<label className="block text-sm font-medium text-gray-700 mb-1">Updated By</label>
									<div className="w-full px-3 py-2 bg-gray-100 rounded-md">
										{editForm.updated_by}
									</div>
								</div>
							)}
							{editForm.updated_at && (
								<div className="mb-4">
									<label className="block text-sm font-medium text-gray-700 mb-1">Updated At</label>
									<div className="w-full px-3 py-2 bg-gray-100 rounded-md">
										{new Date(editForm.updated_at).toLocaleString()}
									</div>
								</div>
							)}
						</div>
					</Section>
					
					<div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
						<button
							type="button"
							onClick={handleBackToSearch}
							className="px-4 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-100 transition"
							disabled={isLoading.submit}
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-5 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
							disabled={isLoading.submit}
						>
							{isLoading.submit ? (
								<>
									<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Saving...
								</>
							) : 'Save Changes'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}