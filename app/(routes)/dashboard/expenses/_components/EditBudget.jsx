'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '../../../../../components/ui/button';
import { ArrowLeft, Trash,Pen } from 'lucide-react'
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
import EmojiPicker from 'emoji-picker-react';
import { useUser } from '@clerk/nextjs';
import { Input } from '../../../../../@/components/ui/input'
import { db } from '../../../../../utils/dbConfig';
import { Budgets } from '../../../../../utils/schema';
import { eq, and } from "drizzle-orm";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function EditBudget({budgetInfo,refreshData}) {
    const[emojiIcon,setEmojiIcon]=useState(budgetInfo?.icon);
  const[openEmojiPicker,setOPenEmojiPicker]=useState(false);
  const [name,setName]=useState();
  const[amount,setAmount]=useState();
  const {user}=useUser();
  const route=useRouter();
  useEffect(() => {
      setEmojiIcon(budgetInfo?.icon);
      setAmount(budgetInfo?.amount);
      setName(budgetInfo?.name);
  },[budgetInfo])
  const onUpdateBudget=async()=>{
    const result= await db.update(Budgets).set({
        name:name,
        amount:amount,
        icon:emojiIcon,
    }).where(eq(Budgets.id,budgetInfo?.id))
    .returning()
    if(result){
        refreshData()
        toast('Budget Updated Successfully')
    }

  }
  return (
    <div>

            <Dialog>
                <DialogTrigger asChild>
                    <Button className="bg-indigo-600"><Pen /> Edit</Button>
                </DialogTrigger>
                <DialogOverlay className="fixed inset-0 bg-black/40 z-40" />

                <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-sm w-full rounded-xl bg-white p-6 shadow-xl z-50">
                    <DialogHeader>
                        <DialogTitle>Update Budget</DialogTitle>
                        <DialogDescription>choose an emoji and enter your budget</DialogDescription>
                        <div className='mt-5'>
                            <Button variant="outline"
                                size="lg"
                                className="text-lg"
                                onClick={() => setOPenEmojiPicker(!openEmojiPicker)}>{emojiIcon}</Button>
                            <div>
                                <EmojiPicker
                                    open={openEmojiPicker}
                                    onEmojiClick={(e) => {
                                        setEmojiIcon(e.emoji)
                                        setOPenEmojiPicker(false)
                                    }}
                                />
                            </div>
                            <div className='mt-2'>
                                <h2 className='text-black font-medium my-1'>Budget Name</h2>
                                <Input placeholder='eg.Home decor'
                                    defaultValue={budgetInfo?.name}
                                    onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className='mt-2'>
                                <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                                <Input
                                    type='number'
                                    placeholder='eg.10000Rs'
                                    defaultValue={budgetInfo?.amount}
                                    onChange={(e) => setAmount(e.target.value)} />
                            </div>
                        </div>

                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button
                                disabled={!name || !amount}
                                onClick={() => onUpdateBudget()}
                                className='mt-5 w-full'>Update Budget</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default EditBudget