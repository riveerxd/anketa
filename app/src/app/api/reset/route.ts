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
        { success: false, error: 'Neplatny token' },
        { status: 403 }
      );
    }

    // Reset all votes to 0
    await pool.query<ResultSetHeader>('UPDATE options SET votes = 0');

    // Clear voters table so everyone can vote again
    await pool.query<ResultSetHeader>('DELETE FROM voters');

    return NextResponse.json({
      success: true,
      message: 'Hlasovani bylo resetovano',
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Chyba databaze' },
      { status: 500 }
    );
  }
}
