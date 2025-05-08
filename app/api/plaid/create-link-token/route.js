import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { plaidClient } from '../../../../lib/plaid';

export async function POST() {
  try {
    const authData = auth();  // <-- FIXED
    console.log(authData);    // <-- Now properly logs

    const { userId } = authData;
    
    if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
      }

    const request = {
      user: { client_user_id: userId },
      client_name: 'Expense Tracker',
      products: ['transactions'],
      language: 'en',
      country_codes: ['US'],
    };

    const response = await plaidClient.linkTokenCreate(request);
    return NextResponse.json({ link_token: response.data.link_token });
  } catch (error) {
    console.error('Error creating link token:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
