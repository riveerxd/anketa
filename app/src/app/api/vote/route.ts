import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface OptionRow extends RowDataPacket {
  id: number;
  label: string;
  text: string;
  votes: number;
}

interface VoterRow extends RowDataPacket {
  voter_id: string;
}

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Neplatný požadavek' },
        { status: 400 }
      );
    }
    const { optionId } = body;

    // Get voter ID from cookie
    const voterId = request.cookies.get('voter_id')?.value;

    if (!voterId) {
      return NextResponse.json(
        { success: false, error: 'Chybi identifikace hlasujiciho' },
        { status: 400 }
      );
    }

    if (!optionId || typeof optionId !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Neplatna volba' },
        { status: 400 }
      );
    }

    // Check if already voted
    const [existingVoter] = await pool.query<VoterRow[]>(
      'SELECT voter_id FROM voters WHERE voter_id = ?',
      [voterId]
    );

    if (existingVoter.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Uz jste hlasoval/a', alreadyVoted: true },
        { status: 403 }
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

    // Record the voter
    await pool.query<ResultSetHeader>(
      'INSERT INTO voters (voter_id) VALUES (?)',
      [voterId]
    );

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
      message: 'Hlas byl zaznamenan',
      data: {
        question: 'Kolik salku kavy denne je jeste normalni?',
        options: rows,
        totalVotes,
      },
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Chyba databaze' },
      { status: 500 }
    );
  }
}
