import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { plaidClient } from '@/lib/plaid';
import { db } from '@/utils/dbConfig';
import { bankAccounts } from '@/utils/schema';

export async function POST(request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { public_token, metadata } = await request.json();
    
    // Exchange public token for access token
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token: public_token,
    });
    
    const accessToken = exchangeResponse.data.access_token;
    const itemId = exchangeResponse.data.item_id;
    
    // Get account details
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });
    
    const accounts = accountsResponse.data.accounts;
    
    // Save each account to database
    for (const account of accounts) {
      await db.insert(bankAccounts).values({
        userId,
        institutionId: metadata.institution.id,
        accessToken: accessToken,
        name: account.name,
        mask: account.mask,
        type: account.type,
        subtype: account.subtype,
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error exchanging token:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
