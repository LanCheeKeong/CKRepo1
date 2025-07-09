'use client';
import { Input, Select, Section } from '@/components/employees/addEditForm';
import type { PartialEmployeeFormProps } from '@/lib/types';

export default function EmploymentDetailsSection({ form, onChange, errors }: PartialEmployeeFormProps) {
	return (
		<Section title="Employment Details">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-">
				<Select
					label="Status" 
					name="status" 
					value={form.status || 'A'} 
					onChange={onChange} 
					options={[
						{ value: 'A', label: 'Active' }, 
						{ value: 'I', label: 'Inactive' }
					]} 
					required 
					error={errors.status} 
					className="w-full"
				/>
				
				<Select 
					label="Role" 
					name="role" 
					value={form.role || ''} 
					onChange={onChange} 
					options={[
						{ value: '', label: 'Select Role' }, 
						{ value: 'Admin', label: 'Admin' }, 
						{ value: 'Manager', label: 'Manager' }, 
						{ value: 'Employee', label: 'Employee' }
					]} 
					className="w-full"
				/>
				
				<Input 
					label="Basic Salary" 
					name="basic_salary" 
					type="number" 
					value={form.basic_salary ?? ''} 
					onChange={onChange} 
					placeholder="5000.00" 
					min="0" 
					step="0.01" 
					error={errors.basic_salary} 
					className="w-full"
				/>
				
				<Input 
					label="Join Date" 
					name="join_date" 
					type="date" 
					value={form.join_date || ''} 
					onChange={onChange} 
					className="w-full"
				/>
				
				<Input 
					label="Position" 
					name="position" 
					value={form.position || ''} 
					onChange={onChange} 
					placeholder="Software Engineer" 
					className="w-full"
				/>
				
				<Select 
					label="Department" 
					name="department_id" 
					value={form.department_id || ''} 
					onChange={onChange} 
					options={[
						{ value: '', label: 'Select Department' }, 
						{ value: '1', label: 'IT' }, 
						{ value: '2', label: 'HR' }, 
						{ value: '3', label: 'Finance' }
					]} 
					className="w-full"
				/>
			</div>
		</Section>
	);
}