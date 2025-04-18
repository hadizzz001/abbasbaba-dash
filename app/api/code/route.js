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

export async function GET(req) {
  try {
    const codes = await prisma.code.findMany();
    return new Response(JSON.stringify(codes), { status: 200 });
  } catch (error) {
    console.error('Error fetching codes:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch codes' }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const generatedCode = generateRandomCode();
    const savedCode = await prisma.code.create({
      data: { code: generatedCode },
    });
    return new Response(
      JSON.stringify({ message: 'Code created successfully', code: savedCode }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating code:', error);
    return new Response(JSON.stringify({ error: 'Failed to create code' }), { status: 500 });
  }
}
