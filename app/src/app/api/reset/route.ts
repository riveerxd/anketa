import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader } from 'mysql2';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    const validToken = process.env.RESET_TOKEN;

    if (!token || token !== validToken) {
      return NextResponse.json(
        { success: false, error: 'Neplatný token' },
        { status: 403 }
      );
    }

    // Reset all votes to 0
    await pool.query<ResultSetHeader>('UPDATE options SET votes = 0');

    return NextResponse.json({
      success: true,
      message: 'Hlasování bylo resetováno',
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Chyba databáze' },
      { status: 500 }
    );
  }
}
