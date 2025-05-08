'use client'
import AddExpense from '../_components/AddExpense'
import { db } from '../../../../../utils/dbConfig'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation' // Correct import
import { getTableColumns, sql } from 'drizzle-orm'
import { Budgets } from '../../../../../utils/schema'
import { eq, and } from "drizzle-orm"; // Add 'and' for combining conditions
import { useUser } from '@clerk/nextjs' // Fixed import (not 'user')
import { Expenses } from '../../../../../utils/schema'
import BudgetItem from '../../budgets/_components/BudgetItem'
import { desc } from 'drizzle-orm';
import ExpenseListTable from '../_components/ExpenseListTable'
import { Button } from '../../../../../components/ui/button';
import { ArrowLeft, Trash,Pen } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogOverlay,
} from "../../../../../@/components/ui/alert-dialog"
import {toast} from 'sonner'
import EditBudget from '../_components/EditBudget'


function ExpensesScreen() {
  const { user } = useUser();
  const params = useParams();
  const { id } = params;
  const [budgetInfo, setbudgetInfo] = useState(null); // Initialize with null
  const [loading, setLoading] = useState(true); // Add loading state
  const [expensesList, setExpensesList] = useState([]);
  const route=useRouter();
  useEffect(() => {
    if (user) {
      getBudgetInfo();
    }
  }, [user, id]); // Add id to dependency array

  const getBudgetInfo = async () => {
    try {
      setLoading(true);
      const result = await db.select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number)
      })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(
          and(
            eq(Budgets.createdBy, user.primaryEmailAddress.emailAddress),
            eq(Budgets.id, id)
          )
        )
        .groupBy(Budgets.id);
      getExpenseList();

      if (result.length > 0) {
        setbudgetInfo(result[0]);
      } else {
        setbudgetInfo(null); // Handle no results
      }
    } catch (error) {
      console.error("Error fetching budget:", error);
    } finally {
      setLoading(false);
    }
  };

  const getExpenseList = async () => {
    const result = await db.select().from(Expenses)
      .where(eq(Expenses.budgetId, id))
      .orderBy(desc(Expenses.id));
    setExpensesList(result);
    console.log(result)

  }

  const deletebudget = async () => {
    const deleteExpensesResult = await db.delete(Expenses)
    .where(eq(Expenses.budgetId, id))
    .returning()
    if(deleteExpensesResult)
    {
      const result = await db.delete(Budgets)
      .where(eq(Budgets.id, id))
      .returning();
    }
    toast('Budget Deleted Successfully')
    route.replace('/dashboard/budgets');
  }

  return (
    <div className='p-10'>
      <h2 className='text-2xl font-bold mb-5 flex justify-between items-center'>
        <span className='flex gap-2 items-center'>
        <ArrowLeft onClick={()=>route.back()} className='cursor-pointer'/>My Expenses
        </span>
        <div className="flex gap-2 justify-end items-center">
          <EditBudget budgetInfo={budgetInfo}
           refreshData={getBudgetInfo}/>

      <AlertDialog>
          <AlertDialogTrigger asChild>
          <Button className='flex gap-4  ' variant="destructive" > <Trash /> Delete</Button>
          </AlertDialogTrigger>
          <AlertDialogOverlay className="bg-black/40 backdrop-blur-sm" />
          <AlertDialogContent className = "max-w-sm mx-auto rounded-lg bg-white text-black shadow-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your Current Budget along with expenses
                and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex justify-between">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="mt-2"onClick={()=>deletebudget()}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </div>

      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'> {/* Fixed 'grid' typo */}
        {loading ? (
          <div className="animate-pulse bg-white p-4 rounded shadow mb-4 w-full">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ) : budgetInfo ? (
          <BudgetItem
            budget={budgetInfo}

          />
        ) : (
          <p>No budget found</p>
        )}
        <AddExpense budgetId={Number(id)}
          user={user}
          refreshData={() => getBudgetInfo()}
        />
      </div>
      <div className='mt-4'>
        <ExpenseListTable expensesList={expensesList}
          refreshData={() => getBudgetInfo()} />

      </div>
    </div>
  )
}

export default ExpensesScreen;
