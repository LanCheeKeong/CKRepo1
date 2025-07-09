// utils/createEmployees.ts
import { hashPassword, generateSalt } from '@/lib/auth';
import pool from '@/lib/db';

interface EmployeeData {
	full_name: string;
	password: string;
	email?: string | null;
	status?: 'A' | 'I';
	position?: string | null;
	department_id?: number | null;
	hire_date?: Date | string | null;
	created_by: string;
	phone?: string | null;
	gender?: string | null;
	date_of_birth?: Date | string | null;
	role?: string | null;
	basic_salary?: number | null;
	epf_number?: string | null;
	epf_percent?: number | null;
	socso_number?: string | null;
	socso_percent?: number | null;
	tax_percent?: number | null;
	ic?: string | null;
}

export async function createUser(employeeData: EmployeeData) {
	// Validate required fields
	if (!employeeData.full_name?.trim()) {
		throw new Error('Full name is required');
	}
	
	if (!employeeData.password) {
		throw new Error('Password is required');
	}

	if (employeeData.password.length < 8) {
		throw new Error('Password must be at least 8 characters');
	}

	// Generate credentials
	const salt = await generateSalt();
	const passwordHash = await hashPassword(employeeData.password, salt);

	// Connect to the database
	const client = await pool.connect();
	
	try {
		await client.query('BEGIN');

		const result = await client.query(
			`INSERT INTO t_user_mstr (
				full_name,
				password,
				salt,
				email,
				status,
				position,
				department_id,
				hire_date,
				created_by,
				phone,
				gender,
				date_of_birth,
				role,
				basic_salary,
				epf_number,
				epf_percent,
				socso_number,
				socso_percent,
				tax_percent,
				ic,
				created_at
			) VALUES (
				$1, $2, $3, $4, $5, $6, $7, 
				TO_DATE($8, 'YYYY-MM-DD'), 
				$9, $10, $11, 
				TO_DATE($12, 'YYYY-MM-DD'), 
				$13, $14, $15, $16, $17, $18, $19, $20, NOW()
			)
			RETURNING 
				employee_id, 
				full_name, 
				email, 
				status, 
				position,
				hire_date`,
			[
				employeeData.full_name.trim(),
				passwordHash,
				salt,
				employeeData.email?.trim() || null,
				employeeData.status || 'A',
				employeeData.position?.trim() || null,
				employeeData.department_id || null,
				employeeData.hire_date,
				employeeData.created_by,
				employeeData.phone?.trim() || null,
				employeeData.gender || null,
				employeeData.date_of_birth,
				employeeData.role || null,
				employeeData.basic_salary || null,
				employeeData.epf_number?.trim() || null,
				employeeData.epf_percent || null,
				employeeData.socso_number?.trim() || null,
				employeeData.socso_percent || null,
				employeeData.tax_percent || null,
				employeeData.ic || null
			]
		);

		await client.query('COMMIT');

		if (result.rows.length === 0) {
			throw new Error('Employee creation failed - no data returned');
		}

		return result.rows[0];
	} catch (error) {
		await client.query('ROLLBACK');
		throw new Error(error.message || 'Failed to create employee');
	} finally {
		client.release();
	}
}