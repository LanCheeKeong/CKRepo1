import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
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
      return errorResponse('Authorization token missing', 401);
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
      return errorResponse('Authorization token missing', 401);
    }

    // Verify token and get updater info
    const decoded = verifyToken(token);
    if (!decoded || typeof decoded !== 'object' || !('full_name' in decoded)) {
      return errorResponse('Invalid token payload', 401);
    }
    
    const { id } = await params
		const empID = id;

    const employeeData = await request.json();
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