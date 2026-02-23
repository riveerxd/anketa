import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface OptionRow extends RowDataPacket {
  id: number;
  label: string;
  text: string;
  votes: number;
}

export async function GET() {
  try {
    const [rows] = await pool.query<OptionRow[]>(
      'SELECT id, label, text, votes FROM options ORDER BY id'
    );

    const totalVotes = rows.reduce((sum, row) => sum + row.votes, 0);

    return NextResponse.json({
      success: true,
      data: {
        question: 'Kolik šálků kávy denně je ještě normální?',
        options: rows,
        totalVotes,
      },
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Chyba databáze' },
      { status: 500 }
    );
  }
}
