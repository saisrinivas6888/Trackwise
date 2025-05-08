import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { plaidClient } from '@/lib/plaid';
import { db } from '@/utils/dbConfig';
import { bankAccounts, transactions } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { format, subDays } from 'date-fns';

export async function GET(request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');
    
    if (!accountId) {
      return NextResponse.json({ error: "Account ID is required" }, { status: 400 });
    }
    
    // Get account from database
    const accounts = await db
      .select()
      .from(bankAccounts)
      .where(eq(bankAccounts.id, parseInt(accountId)))
      .where(eq(bankAccounts.userId, userId));
      
    if (accounts.length === 0) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
    
    const account = accounts[0];
    
    // Set date range for transactions (last 30 days)
    const endDate = format(new Date(), 'yyyy-MM-dd');
    const startDate = format(subDays(new Date(), 30), 'yyyy-MM-dd');
    
    // Get transactions from Plaid
    const response = await plaidClient.transactionsGet({
      access_token: account.accessToken,
      start_date: startDate,
      end_date: endDate,
    });
    
    const plaidTransactions = response.data.transactions;
    
    // Save transactions to database
    for (const transaction of plaidTransactions) {
      await db
        .insert(transactions)
        .values({
          userId,
          accountId: account.id,
          externalId: transaction.transaction_id,
          amount: transaction.amount,
          description: transaction.name,
          category: transaction.category ? transaction.category[0] : null,
          date: new Date(transaction.date),
          pending: transaction.pending
        })
        .onConflictDoNothing({ target: transactions.externalId });
    }
    
    // Fetch stored transactions
    const storedTransactions = await db
      .select()
      .from(transactions)
      .where(eq(transactions.accountId, parseInt(accountId)))
      .where(eq(transactions.userId, userId))
      .orderBy(transactions.date);
    
    return NextResponse.json({ transactions: storedTransactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
