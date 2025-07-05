import { NextResponse } from 'next/server';
import { executeDCA } from './dca-engine';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    console.log("📥 Manual DCA trigger requested from API route...");
    await executeDCA();

    return NextResponse.json(
      { message: 'DCA executed successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ DCA execution failed:", error.message);
    return NextResponse.json(
      { message: 'Failed to execute DCA', error: error.message },
      { status: 500 }
    );
  }
}
