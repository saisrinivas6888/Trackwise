import { UserButton } from '@clerk/nextjs';
import React from 'react';

function DashboardHeader({ searchTerm, setSearchTerm }) {
  return (
    <div className='p-5 shadow-md border-b flex justify-between items-center'>
      <input
        className="border rounded px-3 py-2 w-full max-w-xs"
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <UserButton />
    </div>
  );
}

export default DashboardHeader;
