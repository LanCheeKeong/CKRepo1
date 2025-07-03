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