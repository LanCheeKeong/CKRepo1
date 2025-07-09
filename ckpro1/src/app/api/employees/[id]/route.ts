import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken, hashPassword, generateSalt } from '@/lib/auth';
import { getEmployeeById, updateEmployee } from '@/utils/employees/editEmployees';

// Utility function for consistent error responses
const errorResponse = (message: string, status: number, details?: any) => {
	return NextResponse.json(
		{ 
			error: message,
			...(details && { details }) 
		},
		{ status }
	);
};


export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		// Authentication
		const cookieStore = await cookies();
		const token = cookieStore.get('auth-token')?.value;
		
		if (!token) {
			return new Response(JSON.stringify({ error: 'Authorization token missing' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Verify token
		verifyToken(token);

		const { id } = await params
		const empID = id;

		const employee = await getEmployeeById(empID);
		return NextResponse.json(employee);
	} catch (error) {
		console.error('Error fetching employee:', error);
		return errorResponse(
			error instanceof Error ? error.message : 'Database error',
			error instanceof Error && error.message === 'Employee not found' ? 404 : 500
		);
	}
}

export async function PUT(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		// Authentication
		const cookieStore = await cookies();
		const token = cookieStore.get('auth-token')?.value;
		
		if (!token) {
			return new Response(JSON.stringify({ error: 'Authorization token missing' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Verify token and get updater info
		const decoded = verifyToken(token);
		if (!decoded || typeof decoded !== 'object' || !('full_name' in decoded)) {
			return errorResponse('Invalid token payload', 401);
		}
		
		const { id } = await params
		const empID = id;
		
		const employeeData = await request.json();
		
		// Handle password update if provided
		if (employeeData.password) {
			if (employeeData.password !== employeeData.confirmPassword) {
				return errorResponse('Password and confirmation do not match', 400);
			}
			
			if (employeeData.password.length < 8) {
				return errorResponse('Password must be at least 8 characters', 400);
			}
			
			
			// Hashed password and salt to the employeeData
			const salt = await generateSalt();
			const hashedPassword = await hashPassword(employeeData.password, salt);
			
			employeeData.password = hashedPassword;
			employeeData.salt = salt;
		} else {
			// Remove password fields if not changing password
			delete employeeData.password;
		}
		
		// Always remove confirmPassword as we don't store it
		delete employeeData.confirmPassword;
		const updatedEmployee = await updateEmployee(empID, {
			...employeeData,
			updated_by: decoded.full_name
		});

		return NextResponse.json(updatedEmployee);
	} catch (error) {
		console.error('Error updating employee:', error);
		
		if (error instanceof Error && error.message.includes('violates foreign key constraint')) {
			return errorResponse('Invalid department reference', 400);
		}
		
		return errorResponse(
			error instanceof Error ? error.message : 'Update failed',
			error instanceof Error && error.message === 'Employee not found' ? 404 : 500
		);
	}
}