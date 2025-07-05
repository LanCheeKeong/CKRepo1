import pool from '@/lib/db';

interface EmployeeUpdateData {
	full_name: string;
	email?: string | null;
	ic?: string | null;
	phone?: string | null;
	gender?: string | null;
	date_of_birth?: string | null;
	status: 'A' | 'I';
	role?: string | null;
	basic_salary?: number | null;
	join_date?: string | null;
	epf_number?: string | null;
	epf_percent?: number | null;
	socso_number?: string | null;
	socso_percent?: number | null;
	tax_percent?: number | null;
	department_id?: number | null;
	position?: string | null;
	updated_by: string;
}

export async function getEmployeeById(employeeId: string) {
	const client = await pool.connect();
	try {
		const { rows } = await client.query(
			`SELECT 
				employee_id,
				full_name,
				email,
				ic,
				phone,
				gender,
				TO_CHAR(date_of_birth, 'YYYY-MM-DD') as date_of_birth,
				status,
				role,
				basic_salary,
				TO_CHAR(join_date, 'YYYY-MM-DD') as join_date,
				epf_number,
				epf_percent,
				socso_number,
				socso_percent,
				tax_percent,
				department_id,
				position,
				created_by,
				TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
				updated_by,
				TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at
			 FROM t_user_mstr 
			 WHERE employee_id = $1`,
			[employeeId]
		);
		
		if (rows.length === 0) {
			throw new Error('Employee not found');
		}
		
		return rows[0];
	} finally {
		client.release();
	}
}

export async function updateEmployee(employeeId: string, employeeData: EmployeeUpdateData) {
	const client = await pool.connect();
	try {
		await client.query('BEGIN');

		// Verify employee exists
		const checkResult = await client.query(
			'SELECT 1 FROM t_user_mstr WHERE employee_id = $1',
			[employeeId]
		);
		
		if (checkResult.rowCount === 0) {
			throw new Error('Employee not found');
		}
		
		const { rows } = await client.query(
			`UPDATE t_user_mstr SET
				full_name = $1,
				email = CASE WHEN $2::text = '' THEN NULL ELSE COALESCE($2, email) END,
				ic = COALESCE($3, ic),
				phone = COALESCE($4, phone),
				gender = COALESCE($5, gender),
				date_of_birth = CASE WHEN $6::text = '' OR $6 IS NULL THEN NULL ELSE TO_DATE($6, 'YYYY-MM-DD') END,
				status = $7,
				role = COALESCE($8, role),
				basic_salary = COALESCE($9, basic_salary),
				join_date = CASE WHEN $10::text = '' OR $10 IS NULL THEN NULL ELSE TO_DATE($10, 'YYYY-MM-DD') END,
				epf_number = COALESCE($11, epf_number),
				epf_percent = COALESCE($12, epf_percent),
				socso_number = COALESCE($13, socso_number),
				socso_percent = COALESCE($14, socso_percent),
				tax_percent = COALESCE($15, tax_percent),
				department_id = COALESCE($16, department_id),
				position = COALESCE($17, position),
				updated_by = $18,
				updated_at = NOW()
			WHERE employee_id = $19
			RETURNING *`,
			[
				employeeData.full_name,
				employeeData.email === '' ? null : employeeData.email || null,
				employeeData.ic || null,
				employeeData.phone || null,
				employeeData.gender || null,
				employeeData.date_of_birth || '',
				employeeData.status,
				employeeData.role || null,
				employeeData.basic_salary || null,
				employeeData.join_date || '',
				employeeData.epf_number || null,
				employeeData.epf_percent || null,
				employeeData.socso_number || null,
				employeeData.socso_percent || null,
				employeeData.tax_percent || null,
				employeeData.department_id || null,
				employeeData.position || null,
				employeeData.updated_by,
				employeeId
			]
		);
		
		await client.query('COMMIT');
		return rows[0];
	} catch (error) {
		await client.query('ROLLBACK');
		throw error;
	} finally {
		client.release();
	}
}