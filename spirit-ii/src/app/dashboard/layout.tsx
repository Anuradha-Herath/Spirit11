"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check authentication status
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
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

  if (!isAuthenticated) {
    return null; // The useEffect will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-white text-2xl font-bold tracking-tight">
                  Spirit<span className="text-yellow-400">II</span>
                </h1>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link 
                    href="/dashboard" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === "/dashboard" ? "bg-blue-700 text-white" : "text-white hover:bg-blue-500"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/dashboard/players" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname.startsWith("/dashboard/players") ? "bg-blue-700 text-white" : "text-white hover:bg-blue-500"
                    }`}
                  >
                    Players
                  </Link>
                  <Link 
                    href="/dashboard/select-team" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname.startsWith("/dashboard/select-team") ? "bg-blue-700 text-white" : "text-white hover:bg-blue-500"
                    }`}
                  >
                    Select Team
                  </Link>
                  <Link 
                    href="/dashboard/team" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === "/dashboard/team" ? "bg-blue-700 text-white" : "text-white hover:bg-blue-500"
                    }`}
                  >
                    My Team
                  </Link>
                </div>
              </div>
            </div>
            <div>
              <button 
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu for smaller screens */}
      <div className="md:hidden bg-blue-500 p-2">
        <div className="flex space-x-2 overflow-x-auto">
          <Link 
            href="/dashboard" 
            className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
              pathname === "/dashboard" ? "bg-blue-700 text-white" : "text-white hover:bg-blue-600"
            }`}
          >
            Dashboard
          </Link>
          <Link 
            href="/dashboard/players" 
            className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
              pathname.startsWith("/dashboard/players") ? "bg-blue-700 text-white" : "text-white hover:bg-blue-600"
            }`}
          >
            Players
          </Link>
          <Link 
            href="/dashboard/select-team" 
            className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
              pathname.startsWith("/dashboard/select-team") ? "bg-blue-700 text-white" : "text-white hover:bg-blue-600"
            }`}
          >
            Select Team
          </Link>
          <Link 
            href="/dashboard/team" 
            className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
              pathname === "/dashboard/team" ? "bg-blue-700 text-white" : "text-white hover:bg-blue-600"
            }`}
          >
            My Team
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
