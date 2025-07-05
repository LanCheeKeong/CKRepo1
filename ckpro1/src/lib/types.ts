export interface User {
		employee_id: number;
		full_name: string;
		email: string;
		password: string;
		salt: string;
		position: string;
		status: string;
}

export interface AuthUser {
		employeeID: number;
		full_name: string;
		email: string;
		ic: number;
		position: string;
		status: string;
}

export interface LeaveData {
	id: number;
	employee: string;
	position: string;
	startDate: Date;
	endDate: Date;
	type: string;
	status: "Approved" | "Pending" | "Rejected";
}

export interface Employee {
  employee_id: number;
  full_name: string;
  email?: string | null;
  password?: string;
  salt?: string;
  ic?: string | null;
  phone?: string | null;
  gender?: string | null;
  date_of_birth?: string | null; // Formatted as 'YYYY-MM-DD'
  status: 'A' | 'I'; // Active or Inactive
  role?: string | null; // 'Admin', 'Manager', 'Employee', etc.
  basic_salary?: number | null;
  join_date?: string | null; // Formatted as 'YYYY-MM-DD'
  epf_number?: number | null;
  epf_percent?: number | null;
  socso_number?: number | null;
  socso_percent?: number | null;
  tax_percent?: number | null;
  department_id?: number | null;
  position?: string | null;
  created_by?: string;
  created_at?: string; // Formatted as 'YYYY-MM-DD HH24:MI:SS'
  updated_by?: string;
  updated_at?: string; // Formatted as 'YYYY-MM-DD HH24:MI:SS'
  
  // For form handling only (not in database)
  confirmPassword?: string; // Only for password confirmation in forms
}