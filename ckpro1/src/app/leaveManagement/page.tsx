import LeaveApplyForm from "@/components/leaveManagement/leaveApplyForm";
import LeaveBalance from "@/components/leaveManagement/leaveBalance";
import PendingRequests from "@/components/leaveManagement/leavePending";

export default function LeaveManagement() {
	return (
		<div className="pb-6 space-y-6">

			{/* Leave Application Section */}
			<section className="bg-white p-4 rounded-lg shadow">
				<h2 className="text-lg font-semibold mb-4">Apply for Leave</h2>
				<LeaveApplyForm />
			</section>

			{/* Leave Balance Summary */}
			<section className="bg-white p-4 rounded-lg shadow">
				<h2 className="text-lg font-semibold mb-4">Your Leave Balance</h2>
				<LeaveBalance />
			</section>

			{/* Pending Approvals (for managers) */}
			<section className="bg-white p-4 rounded-lg shadow">
				<h2 className="text-lg font-semibold mb-4">Pending Requests</h2>
				<PendingRequests />
			</section>
		</div>
	);
}