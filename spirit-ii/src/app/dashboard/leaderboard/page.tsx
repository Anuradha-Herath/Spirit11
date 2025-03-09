"use client";

import { useState, useEffect } from "react";

// Define interface for leaderboard entries
interface LeaderboardEntry {
  username: string;
  points: number;
  rank?: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Get current user from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user.username || "");
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
    
    // Fetch leaderboard data from API
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/leaderboard');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch leaderboard: ${response.status}`);
        }
        
        const data = await response.json();
        
        // If current user is not in the leaderboard but has points, add them
        if (userData) {
          try {
            const user = JSON.parse(userData);
            const userExists = data.some((entry: LeaderboardEntry) => 
              entry.username === user.username
            );
            
            if (!userExists && user.points) {
              // Add the user to the list (will be sorted later)
              data.push({
                username: user.username,
                points: user.points
              });
              
              // Resort and rerank
              data.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.points - a.points);
              data.forEach((entry: LeaderboardEntry, index: number) => {
                entry.rank = index + 1;
              });
            }
          } catch (e) {
            console.error("Error processing user data for leaderboard", e);
          }
        }
        
        setLeaderboard(data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("Failed to load leaderboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
        <p className="text-red-700">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Leaderboard</h1>
      <p className="text-gray-600 mb-6">See how you rank against other players.</p>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 text-white p-4">
          <h2 className="text-xl font-bold">Player Rankings</h2>
        </div>
        
        <div className="overflow-hidden overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaderboard.map((user) => (
                <tr 
                  key={user.username} 
                  className={`${
                    user.username === currentUser
                      ? "bg-blue-50 hover:bg-blue-100"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.rank! <= 3 ? (
                      <span className={`
                        inline-flex items-center justify-center w-8 h-8 rounded-full text-white font-bold
                        ${user.rank === 1 ? 'bg-yellow-400' : user.rank === 2 ? 'bg-gray-400' : 'bg-amber-600'}
                      `}>
                        {user.rank}
                      </span>
                    ) : (
                      <span className="px-2 font-medium">{user.rank}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {user.username}
                        {user.username === currentUser && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            You
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <span className="font-bold">{user.points}</span>
                    <span className="text-gray-500 ml-1">pts</span>
                  </td>
                </tr>
              ))}
              
              {leaderboard.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    No leaderboard data available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 text-sm text-gray-500">
          <p>Complete your team to see your points on the leaderboard.</p>
        </div>
      </div>
      
      <div className="mt-6 bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 text-white p-4">
          <h2 className="text-xl font-bold">How Points Are Calculated</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Points are calculated based on your team's performance. Each player earns points based on their real-world performance:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Runs scored (1 point per run)</li>
            <li>Wickets taken (20 points per wicket)</li>
            <li>Catches (10 points per catch)</li>
            <li>Stumpings (12 points per stumping)</li>
            <li>Run-outs (6 points per run-out)</li>
            <li>Boundaries (5 bonus points per six, 2 for four)</li>
            <li>Economy rate bonuses for bowlers</li>
            <li>Strike rate bonuses for batsmen</li>
          </ul>
          <p className="mt-4 text-sm text-gray-500">
            The leaderboard updates after each real-world match. Build a balanced team to maximize your points!
          </p>
        </div>
      </div>
    </div>
  );
}
