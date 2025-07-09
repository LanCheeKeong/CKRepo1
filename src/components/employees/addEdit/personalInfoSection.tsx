'use client';
import { Input, Select, Section } from '@/components/employees/addEditForm';
import type { PartialEmployeeFormProps } from '@/lib/types';

export default function PersonalInfoSection({ form, onChange, errors }: PartialEmployeeFormProps) {
	return (
		<Section title="Personal Information">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
				<Input 
					label="Full Name" 
					name="full_name" 
					value={form.full_name || ''} 
					onChange={onChange} 
					required 
					error={errors.full_name} 
					className="w-full"
				/>
				<Input 
					label="Email" 
					name="email" 
					type="email" 
					value={form.email || ''} 
					onChange={onChange} 
					error={errors.email} 
					className="w-full"
				/>
				<Input 
					label="IC Number" 
					name="ic" 
					value={form.ic || ''} 
					onChange={onChange} 
					error={errors.ic} 
					className="w-full"
				/>
				<Input 
					label="Phone" 
					name="phone" 
					value={form.phone || ''} 
					onChange={onChange} 
					className="w-full"
				/>
				<Select 
					label="Gender" 
					name="gender" 
					value={form.gender || ''} 
					onChange={onChange} 
					options={[
						{ value: 'Male', label: 'Male' }, 
						{ value: 'Female', label: 'Female' }, 
						{ value: 'Other', label: 'Other' }
					]} 
					className="w-full"
				/>
				<Input 
					label="Date of Birth" 
					name="date_of_birth" 
					type="date" 
					value={form.date_of_birth || ''} 
					onChange={onChange} 
					className="w-full"
				/>
			</div>
		</Section>
	);
}