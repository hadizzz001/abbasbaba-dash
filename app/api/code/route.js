import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { NextResponse } from 'next/server';

function generateRandomCode(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function PATCH(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), { status: 400 });
    }

    // Fetch the current codes from DB
    const existing = await prisma.code.findUnique({ where: { id } });
    if (!existing) {
      return new Response(JSON.stringify({ error: 'Code record not found' }), { status: 404 });
    }

    const newCode = generateRandomCode();

    const updatedCategory = await prisma.code.update({
      where: { id },
      data: {
        code: [...existing.code, newCode], // append new code
      },
    });

    return new Response(
      JSON.stringify({ message: 'Code added successfully', updatedCategory }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating code:', error);
    return new Response(JSON.stringify({ error: 'Failed to update code' }), { status: 500 });
  }
}




 