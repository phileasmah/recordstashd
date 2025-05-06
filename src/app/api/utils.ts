import { NextResponse } from 'next/server';

export function handleApiError(error: unknown, customMessage: string) {
  console.error(`${customMessage}:`, error);
  return NextResponse.json(
    { error: customMessage },
    { status: 500 }
  );
} 