'use client';
import { useEffect, useState } from 'react';
import { db } from'../../../../../utils/dbConfig';
import { bankAccounts } from '../../../../../utils/schema';
import { eq } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import { CreditCard } from 'lucide-react';
import Link from 'next/link';

export function BankAccountsList() {
  const { user } = useUser();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (user) {
        try {
          const userId = user.id;
          const result = await db
            .select()
            .from(bankAccounts)
            .where(eq(bankAccounts.userId, userId));
          
          setAccounts(result);
        } catch (error) {
          console.error('Error fetching accounts:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAccounts();
  }, [user]);

  if (loading) {
    return <div>Loading accounts...</div>;
  }

  if (accounts.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-slate-50">
        <p className="text-gray-500">No bank accounts linked yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {accounts.map((account) => (
        <div key={account.id} className="p-4 border rounded-lg flex items-center">
          <div className="p-2 bg-blue-100 rounded-full mr-4">
            <CreditCard className="h-6 w-6 text-blue-600" />
          </div>
          
          <div className="flex-1">
            <p className="font-semibold">{account.name}</p>
            <p className="text-sm text-gray-500">**** {account.mask}</p>
            <p className="text-xs text-gray-400">{account.type} • {account.subtype}</p>
          </div>
          
          <Link href={`/dashboard/transactions/${account.id}`}>
            <Button variant="outline" size="sm">
              View Transactions
            </Button>
          </Link>
        </div>
      ))}
    </div>
  );
}
