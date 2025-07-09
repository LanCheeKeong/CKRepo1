export default function LeaveBalance() {
	const balances = [
		{ type: "Annual Leave", total: 12, used: 3, remaining: 9 },
		{ type: "Sick Leave", total: 10, used: 1, remaining: 9 },
		{ type: "Unpaid Leave", total: "-", used: 0, remaining: "-" },
	];

	return (
		<div className="space-y-3">
			{balances.map((balance) => (
				<div key={balance.type} className="flex justify-between items-center p-2 bg-gray-50 rounded">
					<span className="font-medium">{balance.type}</span>
					<span>
						{balance.remaining}/{balance.total} days
					</span>
				</div>
			))}
		</div>
	);
}