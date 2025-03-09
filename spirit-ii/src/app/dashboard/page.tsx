"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUsername(user.username || "Player");
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, []);

  return (
    <div>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">Welcome, {username}!</h1>
        <p className="text-gray-600">
          Ready to build your fantasy cricket team? Complete these steps:
        </p>
        
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-bold text-blue-800">1. Browse Players</h3>
            <p className="text-sm text-gray-600 mb-4">Check out all available players and their stats</p>
            <Link 
              href="/dashboard/players"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              View Players →
            </Link>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h3 className="font-bold text-purple-800">2. Select Your Team</h3>
            <p className="text-sm text-gray-600 mb-4">Select players from different categories</p>
            <Link 
              href="/dashboard/select-team"
              className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center"
            >
              Select Team →
            </Link>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="font-bold text-green-800">3. View Your Team</h3>
            <p className="text-sm text-gray-600 mb-4">Review your team and see your total points</p>
            <Link 
              href="/dashboard/team"
              className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
            >
              View My Team →
            </Link>
          </div>
        </div>
      </div>
      
      {/* Latest updates/news section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Latest Updates</h2>
        <div className="border-l-4 border-blue-500 pl-4 mb-4">
          <p className="text-sm text-gray-500">May 15, 2023</p>
          <h3 className="font-bold">Weekly Stats Updated</h3>
          <p className="text-gray-600">All player statistics have been updated after the latest matches.</p>
        </div>
        <div className="border-l-4 border-green-500 pl-4">
          <p className="text-sm text-gray-500">May 12, 2023</p>
          <h3 className="font-bold">New Players Added</h3>
          <p className="text-gray-600">Check out the new players added from University of Colombo.</p>
        </div>
      </div>
    </div>
  );
}
