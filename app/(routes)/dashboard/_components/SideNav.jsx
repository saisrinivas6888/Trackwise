'use client'
import React from 'react'
import Image from 'next/image'
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck ,CreditCard, Star } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import path from 'path';
import Link from 'next/link'

function SideNav() {
    const menuList = [
        {
            id:1,
            name:"Dashboard",
            icon:LayoutGrid,
            path:'/dashboard'
        },
        {
            id:2,
            name: 'My Budgets',
            icon:PiggyBank,
            path:'/dashboard/budgets'
        },
        {
            id:3,
            name:'Expenses',
            icon:ReceiptText,
            path:'/dashboard/expenses'
        },
        {
            id:4,
            name:'chat',
            icon:Star,
            path:'/dashboard/upgrade'
        },
        
        // Add to your existing navigation items
       {
        path: '/dashboard/cards',
        name: 'Cards',
        icon: CreditCard // import this from lucide-react
        }
  

    ]
    const pathname = usePathname();
    useEffect(() => {
        console.log("Current path:", pathname);
    }, [pathname]);
    
  return (
    <div className='h-screen p-4 border shadow-md'>
         {/* Logo */}
         <div className="flex items-center gap-3 mb-10">
                <Image src="/logo.svg" alt="Logo" width={40} height={40} />
                <span className="text-black text-2xl font-bold">TrackWise</span>
            </div>
                <div>
                    {menuList.map((menu,index)=>(
                        <Link key = {index} href={menu.path}>
                        <h2 key={menu.id}className = {`flex gap-2 items-center text-gray-500 font font-medium mb-2 p-5 cursor-pointer rounded-md hover:text-primary hover:bg-blue-100 ${pathname==menu.path&&'text-primary bg-blue-100'}`}>
                            <menu.icon/>
                            {menu.name}
                        </h2>
                        </Link>

                    )
                    )}
                </div>
                <div className='fixed left-0 bottom-10 p-6 flex gap-3 items-center'>
                    <UserButton/>
                     Profile
                </div>
        
    </div>
  )
}

export default SideNav;