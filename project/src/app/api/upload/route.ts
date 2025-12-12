import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      status: 'ok',
      message: 'Upload endpoint placeholder',
    },
    { status: 200 }
  );
}
