import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import * as dcaEngine from './dca-engine.js';

export async function POST(req: NextRequest) {
  try {
    console.log("📥 Manual DCA trigger requested from API route...");
    
    // Parse the request body
    const body = await req.json();
    const { allocations, amount, frequency } = body;
    
    console.log("📋 User DCA plan:", { allocations, amount, frequency });
    
    // Execute DCA with user's plan
    await dcaEngine.executeDCA();

    return NextResponse.json(
      { 
        message: 'DCA executed successfully',
        plan: { allocations, amount, frequency }
      },
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
