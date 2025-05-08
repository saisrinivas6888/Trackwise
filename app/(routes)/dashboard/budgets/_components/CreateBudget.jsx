'use client'
import React, { useState } from 'react'
import { useUser } from '@clerk/nextjs';
import { user } from '@clerk/nextjs';
import {Button} from "../../../../../components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogTrigger,
  } from "../../../../../@/components/ui/dialog"
import EmojiPicker from 'emoji-picker-react'
import { Input } from '../../../../../@/components/ui/input'
import { Budgets } from '../../../../../utils/schema'
import { db } from '../../../../../utils/dbConfig';
import { toast } from 'sonner'

  

function CreateBudget({refreshData}) {
  const[emojiIcon,setEmojiIcon]=useState('😊');
  const[openEmojiPicker,setOPenEmojiPicker]=useState(false);
  const [name,setName]=useState();
  const[amount,setAmount]=useState();
  const {user}=useUser();
  const onCreateBudget=async()=>{
    const result=await db.insert(Budgets)
    .values({
      name:name,
      amount:amount,
      icon:emojiIcon,
      createdBy:user?.primaryEmailAddress?.emailAddress,
    }).returning({insertedId:Budgets.id})
    if(result)
    {
      refreshData()
      toast('New Budget Created Successfully!!');
    }
  }
  return (
    <div>
        <Dialog>
             <DialogTrigger asChild>   
                <div className='bg-slate-100 p-16 rounded-md
                items-center flex flex-col border-2 border-dashed
                cursor-pointer hover:shadow-md'>
                <h2 className='text-3xl'>
                      + 
                 </h2>
               <h2 className='ml-[-4px]'>
                  Create New Budget
               </h2>
              </div>
            </DialogTrigger>
            <DialogOverlay className="fixed inset-0 bg-black/40 z-40" />

            <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-sm w-full rounded-xl bg-white p-6 shadow-xl z-50"> 
                  <DialogHeader>
                    <DialogTitle>Create New Budget</DialogTitle>
                    <DialogDescription>choose an emoji and enter your budget</DialogDescription>
                      <div className='mt-5'>
                      <Button variant="outline"
                      size="lg"
                      className="text-lg"
                      onClick={() => setOPenEmojiPicker(!openEmojiPicker)}>{emojiIcon}</Button>
                      <div>
                        <EmojiPicker
                      open={openEmojiPicker}
                      onEmojiClick={(e)=>{
                        setEmojiIcon(e.emoji)
                        setOPenEmojiPicker(false)
                      }}
                      />
                      </div>
                      <div className='mt-2'>
                        <h2 className='text-black font-medium my-1'>Budget Name</h2>
                        <Input placeholder='eg.Home decor'
                        onChange={(e)=>setName(e.target.value)}/>
                      </div>
                      <div className='mt-2'>
                        <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                        <Input
                        type = 'number'
                        placeholder='eg.10000Rs'
                        onChange={(e)=>setAmount(e.target.value)}/>
                      </div>
                    </div>

                  </DialogHeader>
                  <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
          <Button 
                       disabled={!name || !amount}
                       onClick={()=>onCreateBudget()}
                      className ='mt-5 w-full'>Create Budget</Button>
          </DialogClose>
        </DialogFooter>
            </DialogContent>
       </Dialog>

    </div>
  )
}

export default CreateBudget