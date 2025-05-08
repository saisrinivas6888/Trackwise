import { Trash } from 'lucide-react'
import React from 'react'
import { Expenses } from '../../../../../utils/schema'
import {db} from '../../../../../utils/dbConfig'
import { eq } from 'drizzle-orm'
import { toast } from 'sonner'

function ExpenseListTable({expensesList,refreshData}) {
    const deleteExpense=async(expenses)=>{
        const result=await db.delete(Expenses)
        .where(eq(Expenses.id,expenses.id))
        .returning();

        if(result){
            toast('Expense Deleted Successfully')
            refreshData()
        }

    }
  return (
    <div className='mt-3'>
        <h2 className='font-bold text-lg'>Latest Expenses</h2>
        <div className='grid grid-cols-4 bg-slate-200 p-4 font-bold gap-3'>
            <h2>Name</h2>
            <h2>Amount</h2>
            <h2>Date</h2>
            <h2>Action</h2>
        </div>
        {expensesList.map((expenses,index)=>(
            <div key={expenses.id} className='grid grid-cols-4 bg-slate-100 p-4 gap-3'>
            <h2>{expenses.name}</h2>
            <h2>{expenses.amount}</h2>
            <h2>{expenses.createdAt}</h2>
            <h2>
                <Trash className='text-red-600 cursor-pointer'
                  onClick={() => deleteExpense(expenses)}
                  />
                </h2>
            </div>

        ))}
    
    </div>
  )
}

export default ExpenseListTable