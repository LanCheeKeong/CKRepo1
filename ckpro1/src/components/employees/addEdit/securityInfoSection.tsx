'use client';
import { Input, Section } from '@/components/employees/addEditForm';
import type { PartialEmployeeFormProps } from '@/lib/types';

export default function SecurityInfoSection({ 
  form, 
  onChange, 
  errors, 
  isEdit = false 
}: PartialEmployeeFormProps & { isEdit?: boolean }) {
  return (
    <Section title="Security Information">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
        {isEdit && (
          <Input
            label="Employee ID"
            name="employee_id"
            value={form.employee_id || ''}
            onChange={onChange}
            className="w-full"
            disabled={true}
          />
        )}
        <Input 
          label="Password" 
          name="password" 
          type="password" 
          value={form.password || ''} 
          onChange={onChange} 
          required={!isEdit} // Password not required when editing (unless changing it)
          error={errors.password} 
          placeholder={isEdit ? "Leave blank to keep current" : "Minimum 8 characters"}
          minLength={8}
          className="w-full"
        />
        {form.password && ( // Only show confirm if password is being entered
          <Input 
            label="Confirm Password" 
            name="confirmPassword" 
            type="password" 
            value={form.confirmPassword || ''} 
            onChange={onChange} 
            required={!!form.password} // Only required if password is being changed
            error={errors.confirmPassword} 
            placeholder="Re-enter your password"
            className="w-full"
          />
        )}
      </div>
    </Section>
  );
}