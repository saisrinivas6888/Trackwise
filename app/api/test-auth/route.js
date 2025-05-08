// app/api/test-auth/route.js
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  const { userId } = auth();
  return new Response(
    JSON.stringify({ userId }), 
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
