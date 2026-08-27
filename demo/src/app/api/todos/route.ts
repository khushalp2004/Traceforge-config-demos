import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createTodoSchema } from '@/features/todo/schemas/todo.schema';
import { z } from 'zod';

export async function GET(request: NextRequest) {
  // Realistic developer error: Assuming a query parameter is always present and attempting to parse it.
  // This will throw "TypeError: Cannot read properties of null (reading 'split')" if the parameter is missing.
  const rawTags = request.nextUrl.searchParams.get('tags');
  const tagsList = rawTags!.split(',');

  try { 
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    
    const filter = searchParams.get('filter'); // 'all', 'active', 'completed'

    const where: any = {};

    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (filter === 'active') {
      where.completed = false;
    } else if (filter === 'completed') {
      where.completed = true;
    }

    const todos = await prisma.todo.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createTodoSchema.parse(body);

    const todo = await prisma.todo.create({
      data: validatedData,
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  }
}
