import pool from '@/lib/db';

interface SearchEmployeesParams {
	employee_id?: string | number;
	full_name?: string;
	ic?: string;
	department_id?: string | number;
	status?: 'A' | 'I';
}

export async function searchEmployees(params: SearchEmployeesParams) {
	try {
		let query = 'SELECT employee_id, full_name, email, status FROM t_user_mstr WHERE 1=1';
		const queryParams: (string | number)[] = [];

		// Add filters
		if (params.employee_id && !isNaN(Number(params.employee_id))) {
			query += ` AND employee_id = $${queryParams.length + 1}`;
			queryParams.push(Number(params.employee_id));
		}
		if (params.full_name) {
			query += ` AND full_name ILIKE $${queryParams.length + 1}`;
			queryParams.push(`%${params.full_name}%`);
		}
		if (params.ic && !isNaN(Number(params.ic))) {
			query += ` AND ic = $${queryParams.length + 1}`;
			queryParams.push(Number(params.ic));
		}
		if (params.department_id && !isNaN(Number(params.department_id))) {
			query += ` AND department_id = $${queryParams.length + 1}`;
			queryParams.push(Number(params.department_id));
		}
		if (params.status && (params.status === 'A' || params.status === 'I')) {
			query += ` AND status = $${queryParams.length + 1}`;
			queryParams.push(params.status);
		}

		const { rows } = await pool.query(query, queryParams);
		return rows;
	} catch (error) {
		console.error('Database error:', error);
		throw new Error('Failed to fetch employees');
	}
}