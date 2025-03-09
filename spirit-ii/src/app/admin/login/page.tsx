"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errorType, setErrorType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrorType("");
    setDebugInfo("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setErrorType(data.errorType || 'unknown');
        throw new Error(data.message || 'Invalid credentials');
      }
      
      // Store admin authentication state
      localStorage.setItem("adminUser", JSON.stringify({ 
        username: data.username,
        email: data.email,
        isAdmin: true,
        isLoggedIn: true 
      }));
      
      // Show success message
      setDebugInfo("Login successful! Redirecting...");
      
      // Redirect specifically to the admin dashboard
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      setDebugInfo(`Attempted login with: ${username}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if we have test mode enabled
  const handleTestAdminCreation = async () => {
    setIsLoading(true);
    setDebugInfo("Creating test admin account...");
    
    try {
      const response = await fetch('/api/auth/create-test-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      setDebugInfo(data.message || "Admin account check complete");
    } catch (error) {
      setDebugInfo("Failed to check admin account");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get user-friendly error message
  const getErrorHelp = () => {
    switch(errorType) {
      case 'user_not_found':
        return "This username doesn't exist in our database. Please check for typos.";
      case 'not_admin':
        return "This account exists but doesn't have admin privileges.";
      case 'wrong_password':
        return "The password you entered is incorrect.";
      default:
        return null;
    }
  };

  const errorHelp = getErrorHelp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">
          Spirit<span className="text-blue-600">II</span>
        </h1>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Login
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-red-700">{error}</p>
                {errorHelp && <p className="text-red-600 text-sm mt-1">{errorHelp}</p>}
              </div>
            )}

            {debugInfo && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <p className="text-blue-700">{debugInfo}</p>
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isLoading ? "Logging in..." : "Admin Login"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative flex justify-center text-sm">
              <Link href="/" className="font-medium text-blue-600 hover:text-blue-500">
                Return to home
              </Link>
            </div>
            <div className="mt-3 text-center">
              <button 
                onClick={handleTestAdminCreation}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Verify admin account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
