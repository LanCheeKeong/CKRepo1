// app/api/employees/route.ts
import { Pool } from 'pg';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken, hashPassword, generateSalt } from '@/lib/auth';
import { createUser } from '@/utils/employees/createEmployees';
import { searchEmployees } from '@/utils/employees/searchEmployees';

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

// Helper function for consistent error responses
const errorResponse = (message: string, status: number, details?: any) => {
	return NextResponse.json(
		{ 
			error: message,
			...(details && { details }) 
		},
		{ status }
	);
};


export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		// Authentication
		const cookieStore = await cookies();
		const token = cookieStore.get('auth-token')?.value;
		
		if (!token) {
			return NextResponse.json(
				{ error: 'Authorization token missing' },
				{ status: 401 }
			);
		}
		
		const params = {
			employee_id: searchParams.get('employee_id'),
			full_name: searchParams.get('full_name'),
			ic: searchParams.get('ic'),
			department_id: searchParams.get('department_id'),
			status: searchParams.get('status') as 'A' | 'I' | null
		};

		const employees = await searchEmployees(params);
		return NextResponse.json(employees);
		
	} catch (error: any) {
		console.error('Error fetching employees:', error);
		return errorResponse(
			error.message || 'Internal server error',
			error.message.includes('token') ? 401 : 500
		);
	}
}

export async function POST(request: Request) {
	try {
		// Authentication
		const cookieStore = await cookies();
		const token = cookieStore.get('auth-token')?.value;
		
		if (!token) {
			return errorResponse('Authorization token missing', 401);
		}

		// Verify token and get creator info
		const decoded = verifyToken(token);
		if (!decoded || typeof decoded !== 'object' || !('full_name' in decoded)) {
			return errorResponse('Invalid token payload', 401);
		}
		const createdBy = decoded.full_name;

		// Get employee data from request
		const employeeData = await request.json();
		
		// Add created_by to the data
		const dataWithCreator = {
			...employeeData,
			created_by: createdBy
		};

		// This will call your createEmployees.ts utility
		const newEmployee = await createUser(dataWithCreator);
		
		return NextResponse.json(newEmployee);
	} catch (error: any) {
		console.error('Error creating employee:', error);
		return errorResponse(
			error.message || 'Internal server error',
			error.message.includes('token') ? 401 : 500
		);
	}
}