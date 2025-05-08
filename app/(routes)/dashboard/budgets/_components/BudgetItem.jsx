import React from 'react'
import Link from 'next/link';


function BudgetItem({budget}) {
    const calculateProgressPerc=()=>{
        const perc=(budget.totalSpend/budget.amount)*100;
        return perc.toFixed(2);
    }
  return (
    <Link href={'/dashboard/expenses/'+budget?.id} >
        <div className='p-5 border rounded-lg gap-2 flex-col text-xl hover:shadow-lg cursor-pointer h-[180px]'>
        <div className='flex w-full items-center justify-between'>
         <div className='ml-2 flex gap-2 items-center'>
            <h2 className='text-3xl p-4 bg-slate-100 rounded-full '>{budget?.icon}</h2>
            <div className='ml-2'>
                <h2 className='font-bold mb-3'>
                    {budget?.name}
                </h2>
                <h2 className='text-slate-500 text-base'>
                    item {budget.totalItem} 
                </h2>
            </div>
         </div>
        <h2 className='font-medium text-blue-950 text-xl'> Rs {budget.amount}</h2>
        </div>
        <div className='mt-9'>
            <div className='flex items-center justify-between mb-3'>
                <h2 className=' text-base text-slate-600'>Rs {budget.totalSpend?budget.totalSpend:0} Spend</h2>
                <h2 className=' text-base text-slate-600'>Rs {budget.amount-budget.totalSpend} Remaining</h2>
            </div>
            <div className='w-full bg-slate-300 h-2 rounded-full '>
               <div className=' bg-blue-950 h-2 rounded-full '
               style={{
                width:`${calculateProgressPerc()}%`
               }}>
               </div>
            </div>
        </div>
        </div>
    </Link>
  )
}

export default BudgetItem;