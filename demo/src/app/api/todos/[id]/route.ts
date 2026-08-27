import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateTodoSchema } from '@/features/todo/schemas/todo.schema';
import { z } from 'zod';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateTodoSchema.parse(body);

    const todo = await prisma.todo.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(todo);
  } catch (error) {
    console.error('Error updating todo:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.flatten() }, { status: 400 });
    }
    // Check if it's a prisma not found error
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025') {
       return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.todo.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting todo:', error);
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025') {
       return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
  }
}
