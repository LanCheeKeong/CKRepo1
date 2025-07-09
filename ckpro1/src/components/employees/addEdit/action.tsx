'use client';
import type { MouseEventHandler } from 'react';

interface Props {
  isLoading: boolean;
  isRedirecting: boolean;
  onBack: () => void;
  isEdit: boolean;
  hasChanges: boolean;
}

export default function FormActions({ 
	isLoading, 
	isRedirecting, 
	onBack, 
	isEdit = false,
	hasChanges
}: Props) {
	return (
		<div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
			<button 
				type="button" 
				onClick={onBack} 
				disabled={isLoading || isRedirecting} 
				className={`px-4 py-2 border rounded-md transition ${isLoading || isRedirecting ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-gray-600 hover:bg-gray-100'}`}
			>
				Cancel
			</button>
			<button 
				type="submit" 
				disabled={isLoading || isRedirecting || !hasChanges} 
				className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
          isLoading || isRedirecting || !hasChanges
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
			>
				{isLoading ? (
					<>
						<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
							<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						{isEdit ? 'Updating...' : 'Creating...'}
					</>
				) : (
					isEdit ? 'Update Employee' : 'Create Employee'
				)}
			</button>
		</div>
	);
}