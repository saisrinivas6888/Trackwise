'use client'
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { db } from '../../../../utils/dbConfig'
import { desc, eq } from 'drizzle-orm'
import { Budgets, Expenses } from '../../../../utils/schema'
import ExpenseListTable from './_components/ExpenseListTable'

function ExpensesPage() {
  const { user } = useUser();
  const [expenseList, setExpenseList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getAllExpenses();
    }
  }, [user]);

  const getAllExpenses = async () => {
    setLoading(true);
    const result = await db.select({
      id: Expenses.id,
      name: Expenses.name,
      amount: Expenses.amount,
      createdAt: Expenses.createdAt
    })
      .from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(Expenses.amount));

    setExpenseList(result);
    setLoading(false);
  };

  return (
    <div className="p-8">
      <h2 className="font-bold text-3xl mb-6">All Expenses</h2>
      {loading ? (
        <div className="animate-pulse bg-white p-4 rounded shadow mb-4 w-full">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      ) : (
        <ExpenseListTable
          expensesList={expenseList}
          refreshData={getAllExpenses}
        />
      )}
    </div>
  );
}

export default ExpensesPage;
