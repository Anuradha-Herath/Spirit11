import React from 'react';
import Link from 'next/link';

export const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Spirit II
        </Link>
        <div className="space-x-4">
          <Link href="/" className="hover:text-blue-200">
            Home
          </Link>
          <Link href="/about" className="hover:text-blue-200">
            About
          </Link>
          <Link href="/contact" className="hover:text-blue-200">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};
