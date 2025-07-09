'use client';
import { Section } from '@/components/employees/addEditForm';
import type { PartialEmployeeFormProps } from '@/lib/types';

export default function SecurityInfoSection({ 
	form, 
	isEdit = false 
}: PartialEmployeeFormProps & { isEdit?: boolean }) {
	if (!isEdit) return null;

	return (
		<Section title="Audit Information" spacing={false} className='pb-6'>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
				<div className="space-y-4 sm:space-y-6">
					<div className="w-full">
						<label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
						<div className="w-full px-3 py-2 text-sm bg-gray-100 rounded-md">
							{form.created_by || 'N/A'}
						</div>
					</div>
					
					{form.updated_by && (
						<div className="w-full">
							<label className="block text-sm font-medium text-gray-700 mb-1">Updated By</label>
							<div className="w-full px-3 py-2 text-sm bg-gray-100 rounded-md">
								{form.updated_by}
							</div>
						</div>
					)}
				</div>

				<div className="space-y-4 sm:space-y-6">
					<div className="w-full">
						<label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
						<div className="w-full px-3 py-2 text-sm bg-gray-100 rounded-md">
							{form.created_at ? new Date(form.created_at).toLocaleString() : 'N/A'}
						</div>
					</div>

					{form.updated_at && (
						<div className="w-full">
							<label className="block text-sm font-medium text-gray-700 mb-1">Updated At</label>
							<div className="w-full px-3 py-2 text-sm bg-gray-100 rounded-md">
								{new Date(form.updated_at).toLocaleString()}
							</div>
						</div>
					)}
				</div>
			</div>
		</Section>
	);
}