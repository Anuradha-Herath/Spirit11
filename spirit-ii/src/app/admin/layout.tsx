"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // In a real app, this would check if the current user has admin rights
    // For demo purposes, we'll simulate an admin check
    const checkAdminStatus = () => {
      const user = localStorage.getItem("user");
      if (!user) {
        router.push("/login");
        return;
      }
      
      try {
        const userData = JSON.parse(user);
        // Simulate admin check - in a real app, we would verify against server
        // Here we'll just assume the demo user is an admin
        if (userData.username === "spiritx_2025") {
          setIsAdmin(true);
        } else {
          router.push("/dashboard");
        }
      } catch (e) {
        console.error("Error parsing user data", e);
        router.push("/login");
      }
      
      setIsLoading(false);
    };
    
    checkAdminStatus();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gradient-to-r from-purple-700 to-indigo-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-white text-2xl font-bold tracking-tight">
                  Spirit<span className="text-yellow-400">II</span>
                  <span className="ml-2 text-sm bg-yellow-400 text-purple-900 px-2 py-0.5 rounded-md">ADMIN</span>
                </h1>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link 
                    href="/admin/players" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === "/admin/players" || pathname === "/admin" ? "bg-indigo-900 text-white" : "text-white hover:bg-indigo-800"
                    }`}
                  >
                    Players
                  </Link>
                  <Link 
                    href="/admin/tournament" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === "/admin/tournament" ? "bg-indigo-900 text-white" : "text-white hover:bg-indigo-800"
                    }`}
                  >
                    Tournament Summary
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard"
                className="text-white hover:text-yellow-400 text-sm"
              >
                User Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu for smaller screens */}
      <div className="md:hidden bg-indigo-700 p-2">
        <div className="flex space-x-4 justify-center">
          <Link 
            href="/admin/players" 
            className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
              pathname === "/admin/players" || pathname === "/admin" ? "bg-indigo-900 text-white" : "text-white hover:bg-indigo-800"
            }`}
          >
            Players
          </Link>
          <Link 
            href="/admin/tournament" 
            className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
              pathname === "/admin/tournament" ? "bg-indigo-900 text-white" : "text-white hover:bg-indigo-800"
            }`}
          >
            Tournament Summary
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
