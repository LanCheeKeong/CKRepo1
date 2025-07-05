"use client";
import { useState } from 'react';
import type { Employee } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Section, Input, Select } from '@/component/employeeFormComponents';

export default function EmployeeAdd() {
	const [editForm, setEditForm] = useState<Partial<Employee>>({
		status: 'A',
		gender: '',
		role: '',
		basic_salary: undefined,
		epf_percent: undefined,
		socso_percent: undefined,
		tax_percent: undefined,
		password: ''
	});
	const [isLoading, setIsLoading] = useState(false);
	const [isRedirecting, setIsRedirecting] = useState(false);
	const [formErrors, setFormErrors] = useState<Record<string, string>>({});
	const router = useRouter();

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value, type } = e.target;
		
		setEditForm(prev => ({
			...prev,
			[name]: type === 'number' ? (value === '' ? undefined : Number(value)) : value
		}));
		
		// Clear error if exists
		if (formErrors[name]) {
			setFormErrors(prev => ({ ...prev, [name]: undefined }));
		}
	};

	const validateForm = () => {
		const errors: Record<string, string> = {};
		
		if (!editForm.full_name?.trim()) errors.full_name = 'Full name is required';
		if (!editForm.status) errors.status = 'Status is required';
		
		if (editForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
			errors.email = 'Invalid email format';
		}
		
		if (editForm.ic && !/^\d{6}-\d{2}-\d{4}$/.test(editForm.ic)) {
			errors.ic = 'IC format should be XXXXXX-XX-XXXX';
		}
		
		if (editForm.password !== editForm.confirmPassword) {
			errors.confirmPassword = 'Passwords do not match';
		}

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
		return Object.keys(errors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!validateForm()) {
			toast.error('Please fix the form errors');
			return;
		}

		setIsLoading(true);
		
		try {
			const employeeData = {
				full_name: editForm.full_name || '',
				password: editForm.password || '',
				email: editForm.email || null,
				status: editForm.status as 'A' | 'I' || 'A',
				position: editForm.position || null,
				department_id: editForm.department_id ? Number(editForm.department_id) : null,
				hire_date: editForm.join_date || null,
				phone: editForm.phone || null,
				gender: editForm.gender || null,
				date_of_birth: editForm.date_of_birth || null,
				role: editForm.role || null,
				basic_salary: editForm.basic_salary ? Number(editForm.basic_salary) : null,
				epf_number: editForm.epf_number || null,
				epf_percent: editForm.epf_percent ? Number(editForm.epf_percent) : null,
				socso_number: editForm.socso_number || null,
				socso_percent: editForm.socso_percent ? Number(editForm.socso_percent) : null,
				tax_percent: editForm.tax_percent ? Number(editForm.tax_percent) : null,
				ic: editForm.ic || null
			};

			const response = await fetch('/api/employees', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify(employeeData),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to create employee');
			}

			const result = await response.json();
			
			// Set redirecting state immediately
			setIsRedirecting(true);
			toast.success('Employee created successfully!', {
				position: 'top-center',
				autoClose: 1500,
				hideProgressBar: true,
				onClose: () => {
					router.push(`/employees/edit/${result.employee_id}`);
				}
			});

		} catch (error) {
			console.error('Create failed:', error);
			let errorMessage = 'Failed to create employee';
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			toast.error(errorMessage, { position: 'top-center' });
		} finally {
			setIsLoading(false);
		}
	};

	const handleBackToSearch = () => {
		if (!isLoading && !isRedirecting) {
			router.push('/employees');
		}
	};

	return (
		<div className="container mx-auto px-4 py-8 relative">
			<ToastContainer 
				position="top-center"
				autoClose={1500}
				hideProgressBar
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				toastClassName="text-center"
			/>
			
			{/* Loading/Redirect Overlay */}
			{isRedirecting && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
						<p className="text-lg font-medium text-gray-800">Redirecting to employee edit page...</p>
					</div>
				</div>
			)}
			
			<div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${
				isRedirecting ? 'opacity-50 pointer-events-none' : ''
			}`}>
				<div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
					<button
						onClick={handleBackToSearch}
						disabled={isLoading || isRedirecting}
						className={`flex items-center text-sm font-medium ${
							isLoading || isRedirecting 
								? 'text-gray-400 cursor-not-allowed' 
								: 'text-gray-600 hover:text-gray-800'
						} transition`}
					>
						<svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
						</svg>
						Back to Employee List
					</button>
					<h2 className="text-lg font-semibold text-gray-800">
						Add New Employee
					</h2>
				</div>

				<form onSubmit={handleSubmit} className="p-6">
					<Section title="Personal Information">
						<div className="grid grid-cols-3 gap-6"> {/* 3 columns */}
							<Input 
								label="Full Name" 
								name="full_name" 
								value={editForm.full_name || ''} 
								onChange={handleInputChange} 
								required 
								error={formErrors.full_name}
								gridColumn="span 1" // Each input spans 1 column
							/>
							<Input 
								label="Email" 
								name="email" 
								type="email" 
								value={editForm.email || ''} 
								onChange={handleInputChange}
								error={formErrors.email}
								gridColumn="span 1"
							/>
							<Input 
								label="IC Number" 
								name="ic" 
								value={editForm.ic || ''} 
								onChange={handleInputChange}
								error={formErrors.ic}
								gridColumn="span 1"
							/>
							<Input 
								label="Phone" 
								name="phone" 
								value={editForm.phone || ''} 
								onChange={handleInputChange}
								gridColumn="span 1"
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
								gridColumn="span 1"
							/>
							<Input 
								label="Date of Birth" 
								name="date_of_birth" 
								type="date" 
								value={editForm.date_of_birth || ''} 
								onChange={handleInputChange}
								gridColumn="span 1"
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
								placeholder="Minimum 8 characters"
								minLength={8}
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
								value={editForm.status || 'A'} 
								onChange={handleInputChange}
								options={[
									{ value: "A", label: "Active" },
									{ value: "I", label: "Inactive" }
								]} 
								required 
								error={formErrors.status}
							/>
							<Select 
								label="Role" 
								name="role" 
								value={editForm.role || ''} 
								onChange={handleInputChange}
								options={[
									{ value: "", label: "Select Role" },
									{ value: "Admin", label: "Admin" },
									{ value: "Manager", label: "Manager" },
									{ value: "Employee", label: "Employee" }
								]} 
							/>
							<Input 
								label="Basic Salary" 
								name="basic_salary" 
								type="number" 
								value={editForm.basic_salary ?? ''} 
								onChange={handleInputChange}
								placeholder="5000.00"
								min="0"
								step="0.01"
								error={formErrors.basic_salary}
							/>
							<Input 
								label="Join Date" 
								name="join_date" 
								type="date" 
								value={editForm.join_date || ''} 
								onChange={handleInputChange}
							/>
							<Input 
								label="Position" 
								name="position" 
								value={editForm.position || ''} 
								onChange={handleInputChange}
								placeholder="Software Engineer"
							/>
							<Select 
								label="Department" 
								name="department_id" 
								value={editForm.department_id || ''} 
								onChange={handleInputChange}
								options={[
									{ value: "", label: "Select Department" },
									// You would typically fetch these from an API
									{ value: "1", label: "IT" },
									{ value: "2", label: "HR" },
									{ value: "3", label: "Finance" }
								]} 
							/>
						</div>
					</Section>

					<Section title="Statutory Information">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<Input 
								label="EPF Number" 
								name="epf_number" 
								value={editForm.epf_number || ''} 
								onChange={handleInputChange}
								placeholder="A12345678"
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
							/>
							<Input 
								label="SOCSO Number" 
								name="socso_number" 
								value={editForm.socso_number || ''} 
								onChange={handleInputChange}
								placeholder="1234567890"
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
							/>
						</div>
					</Section>

					<div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
						<button
							type="button"
							onClick={handleBackToSearch}
							disabled={isLoading || isRedirecting}
							className={`px-4 py-2 border rounded-md transition ${
								isLoading || isRedirecting 
									? 'border-gray-200 text-gray-400 cursor-not-allowed' 
									: 'border-gray-300 text-gray-600 hover:bg-gray-100'
							}`}
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isLoading || isRedirecting}
							className={`px-5 py-2 bg-blue-600 text-white font-medium rounded-md transition ${
								isLoading || isRedirecting 
									? 'opacity-70 cursor-not-allowed' 
									: 'hover:bg-blue-700'
							}`}
						>
							{isLoading ? (
								<>
									<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Creating...
								</>
							) : 'Create Employee'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}