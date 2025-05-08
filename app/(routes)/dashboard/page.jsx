'use client'
import React, { useEffect, useState } from 'react'
import { UserButton, useUser } from '@clerk/nextjs'
import CardInfo from './_components/CardInfo'
import { db } from '../../../utils/dbConfig'
import { asc, desc, eq, getTableColumns, sql } from 'drizzle-orm'
import { Budgets, Expenses } from '../../../utils/schema'
import BarChartDashboard from './_components/BarChartDashboard'
import BudgetItem from './budgets/_components/BudgetItem'
import ExpenseListTable from './expenses/_components/ExpenseListTable'

function Dashboard() {
  const { user } = useUser();
  const [budgetList,setBudgetList]=useState([]);
  const [expenseList,setExpenseList]=useState([]);
  
  useEffect(() => {
    user&&getBudgetList();
  },[])

  const getALLExpenses=async()=>{
    const result = await db.select(
      {
       id:Expenses.id,
       name:Expenses.name,
       amount:Expenses.amount,
       createdAt:Expenses.createdAt
      }
    ).from(Budgets)
    .rightJoin(Expenses,eq(Budgets.id,Expenses.budgetId))
    .where(eq(Budgets.createdBy,user?.primaryEmailAddress?.emailAddress))
    .orderBy(desc(Expenses.amount));

    setExpenseList(result);
    console.log(result);
  }
   const getBudgetList=async()=>{
     const result=await db.select({
       ...getTableColumns(Budgets),
       totalSpend:sql`sum(${Expenses.amount})`.mapWith(Number),
       totalItem:sql`count(${Expenses.id})`.mapWith(Number)
     }).from(Budgets)
     .leftJoin(Expenses,eq(Budgets.id,Expenses.budgetId))
     .where(eq(Budgets.createdBy,user?.primaryEmailAddress?.emailAddress))
     .groupBy(Budgets.id)
     .orderBy(asc(Budgets.amount))
     setBudgetList(result);
     getALLExpenses();
     return result
   }

  return (
    <div className='p-8'>
      <h2 className='font-bold text-3xl'>Hi, {user?.fullName}</h2>
      <p> Here's what happening with your money , Lets Manage your expense</p>
      <CardInfo budgetList={budgetList}/>
      <div className='grid grid-cols-1 md:grid-cols-3 mt-6 gap-5'>
        <div className='md:col-span-2'>
          <BarChartDashboard
           budgetList={budgetList}/>
          <ExpenseListTable
          expensesList={expenseList}
          refreshData={()=>getBudgetList()}
          />
        </div>
        <div className='grid gap-3'>
          <h2 className='font-bold text-lg'>Latest Budgets</h2>
          {budgetList.map((budget,index)=>(
            <BudgetItem key={index} budget={budget}/>
            
          ))}
        </div>

      </div>
    </div>
  )
}

export default Dashboard
