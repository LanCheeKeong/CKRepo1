"use client";
import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { Employee } from '@/lib/types';

import PersonalInfoSection from '@/components/employees/addEdit/personalInfoSection';
import SecurityInfoSection from '@/components/employees/addEdit/securityInfoSection';
import EmploymentDetailsSection from '@/components/employees/addEdit/employmentDetailsSection';
import StatutoryInfoSection from '@/components/employees/addEdit/statutoryInfoSection';
import AuditInfoSection from '@/components/employees/addEdit/auditInfo';
import FormActions from '@/components/employees/addEdit/action';
import ConfirmationModal from '@/components/ui/confirmationModal';

export default function EmployeeEdit() {
	const [initialData, setInitialData] = useState<Employee | null>(null);
	const [editForm, setEditForm] = useState<Partial<Employee> & { confirmPassword?: string }>({});
	const [employee, setEmployee] = useState<Employee | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isRedirecting, setIsRedirecting] = useState(false);
	const [formErrors, setFormErrors] = useState<Record<string, string>>({});
	const [showInactiveConfirm, setShowInactiveConfirm] = useState(false);
	const [pendingStatusChange, setPendingStatusChange] = useState<string | null>(null);
	const router = useRouter();
	const { id } = useParams();

	useEffect(() => {
		fetchEmployee();
	}, [id]);

	const hasChanges = useMemo(() => {
		if (!initialData || !editForm) return false;
		
		const { confirmPassword, ...currentForm } = editForm;
		
		return Object.keys(initialData).some(key => {
			// Special handling for numeric fields that might be strings in the form
			const formValue = currentForm[key as keyof typeof currentForm];
			const initialValue = initialData[key as keyof Employee];
			
			// Compare string representations to handle number/string mismatches
			return String(formValue) !== String(initialValue);
		});
	}, [initialData, editForm]);

	const fetchEmployee = async () => {
		try {
			const res = await fetch(`/api/employees/${id}`);
			if (!res.ok) throw new Error('Failed to fetch employee');
			const data = await res.json();
			setEmployee(data);
			setInitialData(data);
			setEditForm({ ...data, confirmPassword: '' });
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Failed to fetch employee');
			setIsRedirecting(true);
			setTimeout(() => router.push('/employees'), 1500);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value, type } = e.target;
		
		// Check if this is a status change to inactive
		if (name === 'status' && value === 'I' && editForm.status !== 'I') {
			setPendingStatusChange(value);
			setShowInactiveConfirm(true);
			return;
		}
		
		setEditForm(prev => ({
			...prev,
			[name]: type === 'number' ? (value === '' ? undefined : Number(value)) : value,
		}));
		if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: undefined }));
	};

	const handleStatusChangeConfirm = (confirmed: boolean) => {
		setShowInactiveConfirm(false);
		if (confirmed && pendingStatusChange) {
			setEditForm(prev => ({
				...prev,
				status: pendingStatusChange as "A" | "I",
			}));
		}
		setPendingStatusChange(null);
	};

	const validateForm = () => {
		const errors: Record<string, string> = {};
		if (!editForm.full_name?.trim()) errors.full_name = 'Full name is required';
		if (!editForm.status) errors.status = 'Status is required';
		if (editForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) errors.email = 'Invalid email format';
		if (editForm.ic && !/^\d{6}-\d{2}-\d{4}$/.test(editForm.ic)) errors.ic = 'IC format should be XXXXXX-XX-XXXX';
		if (editForm.password && editForm.password !== editForm.confirmPassword) errors.confirmPassword = 'Passwords do not match';

		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	// Update your handleSubmit function in the EmployeeEdit component
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!employee || !hasChanges) return;
		if (!validateForm()) return toast.error('Please fix the form errors');
		setIsLoading(true);

		try {
			const res = await fetch(`/api/employees/${employee.employee_id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(editForm),
			});

			if (res.status === 401) {
				// Redirect to login if unauthorized
				router.push('/login');
				return;
			}

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error || 'Failed to update employee');
			}

			toast.success('Employee updated successfully!', { 
				position: 'top-center', 
				autoClose: 1000,
				className: 'bg-black text-white',
				progressClassName: 'bg-blue-500'
			});

			fetchEmployee();
		} catch (error) {
			if (error instanceof Error && error.message.includes('Authorization')) {
				router.push('/login');
			} else {
				toast.error(error instanceof Error ? error.message : 'Failed to update employee', { 
					position: 'top-center',
					className: 'bg-black text-white',
					progressClassName: 'bg-red-500'
				});
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleBack = () => {
		setIsRedirecting(true);
		router.push('/employees');
	};

	if (!employee) return null;

	return (
		<div className='pb-1'>
			<ToastContainer 
				position="top-center"
				autoClose={1500}
				toastClassName="bg-black text-white rounded-lg shadow-lg"
				progressClassName="bg-blue-500"
			/>
			<ConfirmationModal
				isOpen={showInactiveConfirm}
				onClose={() => handleStatusChangeConfirm(false)}
				onConfirm={() => handleStatusChangeConfirm(true)}
				title="Confirm Status Change"
				message="Are you sure you want to set this employee to inactive? This action may restrict their access to the system."
				confirmText="Confirm"
				cancelText="Cancel"
			/>
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
				<div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
					<button 
						onClick={handleBack} 
						disabled={isLoading || isRedirecting} 
						className={`flex items-center text-sm font-medium ${isLoading || isRedirecting ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800'} transition`}
					>
						<svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
						</svg>
						Back to Employee List
					</button>
					<h2 className="text-lg font-semibold text-gray-800">Editing: {employee.full_name}</h2>
				</div>

				<form onSubmit={handleSubmit} className="p-6">
					<PersonalInfoSection 
						form={editForm} 
						onChange={handleInputChange} 
						errors={formErrors} 
					/>
					<SecurityInfoSection 
						form={editForm} 
						onChange={handleInputChange} 
						errors={formErrors} 
						isEdit={true} 
					/>
					<EmploymentDetailsSection 
						form={editForm} 
						onChange={handleInputChange}
						errors={formErrors} 
					/>
					<StatutoryInfoSection 
						form={editForm} 
						onChange={handleInputChange}
						errors={formErrors} 
					/>
					<AuditInfoSection 
						form={editForm} 
						onChange={handleInputChange}
						isEdit={true}
						errors={formErrors} 
					/>
					<FormActions 
						isLoading={isLoading} 
						isRedirecting={isRedirecting} 
						onBack={handleBack}
						isEdit={true}
						hasChanges={hasChanges}
					/>
				</form>
			</div>
		</div>
	);
}