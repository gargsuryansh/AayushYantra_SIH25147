import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  return NextResponse.json(
    {
      status: 'received',
      message: 'Thanks for reaching out to BioFit 3D!',
      payload,
    },
    { status: 200 }
  );
}
