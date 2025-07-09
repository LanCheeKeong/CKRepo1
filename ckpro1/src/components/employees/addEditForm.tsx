"use client";

type SectionProps = {
	title: string;
	children: React.ReactNode;
	className?: string;
};

export const Section = ({ 
	title, 
	children, 
	className = '',
	spacing = true 
}: SectionProps & { spacing?: boolean }) => (
	<div className={`border-b border-gray-200 ${spacing ? 'pb-6 mb-6' : ''} ${className}`}>
		<h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
		{children}
	</div>
);

interface InputProps {
	label: string;
	name: string;
	value?: string | number;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	type?: string;
	required?: boolean;
	className?: string;
	error?: string;
	gridColumn?: string;
	placeholder?: string;
	min?: string | number;
	max?: string | number;
	step?: string | number;
	minLength?: number;
	maxLength?: number;
	forwardRef?: (el: HTMLInputElement) => void;
}

export const Input = ({
	label,
	name,
	value,
	onChange,
	type = 'text',
	required = false,
	className = '',
	error,
	gridColumn = '',
	placeholder,
	min,
	max,
	step,
	minLength,
	maxLength,
	disabled = false,
	...props
}: InputProps & { disabled?: boolean }) => (
	<div className={`mb-4 ${className}`} style={{ gridColumn }}>
		<label className={`block text-sm font-medium mb-1 ${
			disabled ? 'text-gray-500' : 'text-gray-700'
		}`}>
			{label}
			{required && !disabled && <span className="text-red-500 ml-1">*</span>}
		</label>
		<input
			type={type}
			name={name}
			value={value}
			onChange={onChange}
			required={required && !disabled}
			disabled={disabled}
			className={`w-full px-3 py-2 border ${
				error ? 'border-red-500' : 'border-gray-300'
			} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
				disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
			}`}
			placeholder={placeholder}
			min={min}
			max={max}
			step={step}
			minLength={minLength}
			maxLength={maxLength}
			{...props}
		/>
		{error && <p className="mt-1 text-sm text-red-600">{error}</p>}
	</div>
);

type SelectProps = {
	label: string;
	name: string;
	value: string | number; // Handles both string and number values
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	options: { value: string | number; label: string }[];
	required?: boolean;
	error?: string;
	gridColumn?: string;
	className?: string;
};

export const Select = ({
	label,
	name,
	value,
	onChange,
	options,
	required = false,
	error,
	gridColumn = '',
	className = '',
}: SelectProps) => (
	<div className={`mb-4 ${className}`} style={{ gridColumn }}>
		<label className="block text-sm font-medium text-gray-700 mb-1">
			{label}
			{required && <span className="text-red-500 ml-1">*</span>}
		</label>
		<select
			name={name}
			value={value} // Properly handles the value prop
			onChange={onChange}
			required={required}
			className={`w-full px-3 py-2 border ${
				error ? 'border-red-500' : 'border-gray-300'
			} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
		>
			{options.map((option) => (
				<option key={String(option.value)} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
		{error && <p className="mt-1 text-sm text-red-600">{error}</p>}
	</div>
);