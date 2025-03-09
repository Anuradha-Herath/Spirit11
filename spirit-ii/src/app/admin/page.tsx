"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if the user is authenticated as admin
    const adminUser = localStorage.getItem('adminUser');
    
    if (!adminUser) {
      router.push('/admin/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(adminUser);
      if (!parsedUser.isAdmin || !parsedUser.isLoggedIn) {
        router.push('/admin/login');
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      router.push('/admin/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will be redirected by the useEffect
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Admin Dashboard</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* Admin dashboard content */}
            <div className="px-4 py-8 sm:px-0">
              <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
                <p className="text-xl">Welcome to the Admin Dashboard</p>
                {/* Add your admin functionality here */}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}