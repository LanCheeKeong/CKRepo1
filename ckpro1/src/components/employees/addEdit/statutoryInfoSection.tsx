'use client';
import { Input, Section } from '@/components/employees/addEditForm';
import type { PartialEmployeeFormProps } from '@/lib/types';

export default function StatutoryInfoSection({ form, onChange, errors }: PartialEmployeeFormProps) {
	return (
		<Section title="Statutory Information">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
				<Input 
					label="EPF Number" 
					name="epf_number" 
					value={form.epf_number || ''} 
					onChange={onChange} 
					placeholder="A12345678"
					className="w-full"
				/>
				<Input 
					label="EPF Percentage" 
					name="epf_percent" 
					type="number" 
					value={form.epf_percent?.toString() || ''} 
					onChange={onChange} 
					placeholder="11" 
					min="0" 
					max="20" 
					step="0.1" 
					error={errors.epf_percent}
					className="w-full"
				/>
				<Input 
					label="SOCSO Number" 
					name="socso_number" 
					value={form.socso_number || ''} 
					onChange={onChange} 
					placeholder="1234567890"
					className="w-full"
				/>
				<Input 
					label="SOCSO Percentage" 
					name="socso_percent" 
					type="number" 
					value={form.socso_percent?.toString() || ''} 
					onChange={onChange} 
					placeholder="0.5" 
					min="0" 
					max="5" 
					step="0.1" 
					error={errors.socso_percent}
					className="w-full"
				/>
				<Input 
					label="Tax Percentage" 
					name="tax_percent" 
					type="number" 
					value={form.tax_percent?.toString() || ''} 
					onChange={onChange} 
					placeholder="10" 
					min="0" 
					max="30" 
					step="0.1" 
					error={errors.tax_percent}
					className="w-full"
				/>
			</div>
		</Section>
	);
}