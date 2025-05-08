"use client";
import React from 'react';
import Image from 'next/image';
import { Button } from '../../components/ui/button';
import { useUser, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

function Header() {
  const { isSignedIn } = useUser();

  return (
    <header className="flex items-center justify-between px-6 py-4 border shadow-md">
      <div className="flex items-center space-x-3">
        {/* Logo */}
        <Image src="/logo.svg" alt="Logo" width={40} height={40} />

        {/* App Name */}
        <span className="text-black text-xl font-bold">
          TrackWise
        </span>
      </div>

      <div className="flex items-center space-x-4">
        {isSignedIn ? 
          <UserButton />:
          <Link href="/sign-in"> 
          <Button>
            Get Started
          </Button>
          </Link>
        }
      </div>
    </header>
  );
}

export default Header;
