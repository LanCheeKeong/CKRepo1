export interface LeaveData {
	id: number;
	employee: string;
	position: string;
	startDate: Date;
	endDate: Date;
	type: string;
	status: "Approved" | "Pending" | "Rejected";
}