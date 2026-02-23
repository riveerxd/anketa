import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface OptionRow extends RowDataPacket {
  id: number;
  label: string;
  text: string;
  votes: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { optionId } = body;

    if (!optionId || typeof optionId !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Neplatná volba' },
        { status: 400 }
      );
    }

    // Check if option exists
    const [existing] = await pool.query<OptionRow[]>(
      'SELECT id FROM options WHERE id = ?',
      [optionId]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Volba neexistuje' },
        { status: 400 }
      );
    }

    // Increment vote count
    await pool.query<ResultSetHeader>(
      'UPDATE options SET votes = votes + 1 WHERE id = ?',
      [optionId]
    );

    // Get updated results
    const [rows] = await pool.query<OptionRow[]>(
      'SELECT id, label, text, votes FROM options ORDER BY id'
    );

    const totalVotes = rows.reduce((sum, row) => sum + row.votes, 0);

    return NextResponse.json({
      success: true,
      message: 'Hlas byl zaznamenán',
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
