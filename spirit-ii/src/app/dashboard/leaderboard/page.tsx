"use client";

import { useState, useEffect } from "react";

// For demo purposes, we'll use mock data
// In a real application, this would come from an API call to the server
const MOCK_USERS = [
  { username: "spiritx_2025", points: 754 },
  { username: "cricket_master", points: 823 },
  { username: "fantasy_king", points: 711 },
  { username: "team_selector", points: 688 },
  { username: "game_player", points: 645 },
  { username: "runs_hunter", points: 912 },
  { username: "pitch_expert", points: 876 },
  { username: "boundary_hitter", points: 792 },
  { username: "bowling_wizard", points: 834 },
  { username: "wicket_taker", points: 745 }
];

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Get current user from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user.username || "");
        
        // In a real app, we'd fetch the leaderboard data from an API
        // Here we'll use mock data and add the current user if they're not already included
        
        // First, check if the current user is already in our mock data
        const userExists = MOCK_USERS.some(u => u.username === user.username);
        
        // If not, and they have points, add them to the mock data
        let allUsers = [...MOCK_USERS];
        if (!userExists && user.points) {
          allUsers.push({
            username: user.username,
            points: user.points
          });
        }
        
        // Sort by points (descending)
        const sortedLeaderboard = allUsers.sort((a, b) => b.points - a.points);
        
        // Add rank to each user
        const rankedLeaderboard = sortedLeaderboard.map((user, index) => ({
          ...user,
          rank: index + 1
        }));
        
        setLeaderboard(rankedLeaderboard);
      } catch (e) {
        console.error("Error parsing user data", e);
        setLeaderboard(MOCK_USERS.map((user, index) => ({ ...user, rank: index + 1 })));
      }
    } else {
      // If no user is logged in, just show the mock leaderboard
      setLeaderboard(MOCK_USERS.map((user, index) => ({ ...user, rank: index + 1 })));
    }
    
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
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
                    {user.rank <= 3 ? (
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
