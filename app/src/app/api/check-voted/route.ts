import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface VoterRow extends RowDataPacket {
  voter_id: string;
}

export async function GET(request: NextRequest) {
  try {
    const voterId = request.cookies.get('voter_id')?.value;

    if (!voterId) {
      return NextResponse.json({ hasVoted: false });
    }

    const [existingVoter] = await pool.query<VoterRow[]>(
      'SELECT voter_id FROM voters WHERE voter_id = ?',
      [voterId]
    );

    return NextResponse.json({ hasVoted: existingVoter.length > 0 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ hasVoted: false });
  }
}
