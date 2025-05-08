import React from 'react'
import { Input } from '../../../../../@/components/ui/input';
import { useState } from  'react'
import {Button} from "../../../../../components/ui/button"
import { Expenses } from '../../../../../utils/schema';
import { toast } from 'sonner';
import {db} from '../../../../../utils/dbConfig'
import { Budgets } from '../../../../../utils/schema'
import moment from 'moment';

function AddExpense({budgetId,user,refreshData}) {
      const [name,setName]=useState();
      const [amount,setAmount]=useState();
      const addNewExpense=async()=>{
        const createdAt = moment().format('YYYY-MM-DD');
        const result = await db.insert(Expenses).values({
            name:name,
            amount:amount,
            budgetId:budgetId,
            createdAt: createdAt

        }).returning({insertId:Budgets.id});

        console.log(result);
        if(result){
            refreshData()
            toast('Expense Added Successfully');
        }
      }
    return (
        <div className='border p-5 rounded-lg'>
            <h2 className='font-bold text-lg'>Add Expenses</h2>
            <div className='mt-2'>
                <h2 className='text-black font-medium my-1'>Expense Name</h2>
                <Input placeholder='eg.tv'
                    onChange={(e) => setName(e.target.value)} />
            </div>

            <div className='mt-2'>
                <h2 className='text-black font-medium my-1'>Expense Amount</h2>
                <Input placeholder='eg. 1000'
                    onChange={(e) => setAmount(e.target.value)} />
            </div>
            <Button disabled={!(name&&amount)}
            onClick={() => addNewExpense()}
            className ="mt-3 w-full ">Add New Expenses</Button>
        </div>
    )
}

export default AddExpense