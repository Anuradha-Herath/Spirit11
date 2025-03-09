"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTeam, INITIAL_BUDGET_LKR } from '@/contexts/TeamContext';
import { eventService, EVENTS } from '@/lib/event-service';

// Format number to display with commas
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-LK').format(num);
};

export default function TeamPage() {
  const { team, remainingBudget, spentBudget, removePlayer, calculatePoints } = useTeam();
  const [totalPoints, setTotalPoints] = useState<number | null>(null);
  const router = useRouter();
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Calculate total points when team is complete (11 players)
  useEffect(() => {
    if (team.length === 11) {
      setIsUpdating(true);
      
      // Calculate points for each player
      const points = calculatePoints();
      setTotalPoints(points);
      
      // Get auth token
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          const authHeader = `Bearer ${user.username}`;
          
          // Update leaderboard with new points
          fetch('/api/leaderboard/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': authHeader
            },
            body: JSON.stringify({
              username: user.username,
              points: points
            })
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to update leaderboard');
            }
            return response.json();
          })
          .then(data => {
            console.log('Leaderboard updated:', data);
            // Store points in localStorage
            user.points = points;
            localStorage.setItem("user", JSON.stringify(user));
          })
          .catch(error => {
            console.error('Error updating leaderboard:', error);
          })
          .finally(() => {
            setIsUpdating(false);
          });
        } catch (e) {
          console.error("Error updating user points", e);
          setIsUpdating(false);
        }
      } else {
        setIsUpdating(false);
      }
    } else {
      setTotalPoints(null);
    }
  }, [team, calculatePoints]);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = eventService.subscribe(EVENTS.PLAYER_STATS_UPDATED, (data: any) => {
      setUpdateMessage(`Player statistics updated! (${new Date().toLocaleTimeString()})`);
      setTimeout(() => setUpdateMessage(null), 3000);
    });
    
    return () => unsubscribe();
  }, []);

  const handleRemovePlayer = (playerId: string) => {
    removePlayer(playerId);
  };

  const handleAddMorePlayers = () => {
    router.push("/dashboard/select-team");
  };
  
  // Group players by role for better organization
  const playersByRole: Record<string, any[]> = team.reduce((acc, player) => {
    const role = player.role.toLowerCase().replace(' ', '-');
    if (!acc[role]) {
      acc[role] = [];
    }
    acc[role].push(player);
    return acc;
  }, {});
  
  // Define the display order for roles
  const roleDisplayOrder = ['batsman', 'all-rounder', 'wicket-keeper', 'bowler'];
  
  // Sort roles for display
  const sortedRoles = Object.keys(playersByRole).sort((a, b) => {
    return roleDisplayOrder.indexOf(a) - roleDisplayOrder.indexOf(b);
  });

  return (
    <div className="relative">
      {/* Real-time update notification */}
      {updateMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out">
          {updateMessage}
        </div>
      )}
      
      <h1 className="text-2xl font-bold mb-2">My Team</h1>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        {/* Team header */}
        <div className="bg-blue-600 text-white p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold">Team Status: {team.length}/11 Players</h2>
              <p className="text-sm text-blue-100">
                {team.length === 11 
                  ? "Team complete!"
                  : `Add ${11 - team.length} more players to complete your team.`}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                {totalPoints !== null && (
                  <div className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-md font-bold">
                    {isUpdating ? 'Calculating...' : `Total Points: ${totalPoints}`}
                  </div>
                )}
                <div className="bg-green-500 text-white px-4 py-2 rounded-md">
                  Budget: Rs. {formatNumber(remainingBudget)}
                </div>
              </div>
              <p className="text-sm text-blue-100 mt-1">
                Spent: Rs. {formatNumber(spentBudget)} of Rs. {formatNumber(INITIAL_BUDGET_LKR)}
              </p>
            </div>
          </div>
        </div>
        
        {/* Team content with responsive design */}
        <div className="p-4">
          {team.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">You haven&apos;t added any players to your team yet.</p>
              <button 
                onClick={handleAddMorePlayers}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Select Players
              </button>
            </div>
          ) : (
            <div>
              {/* Team by role sections */}
              {sortedRoles.map(role => (
                <div key={role} className="mb-6">
                  <h3 className="font-bold text-lg mb-2 border-b pb-1">
                    {role.charAt(0).toUpperCase() + role.slice(1).replace('-', ' ')}s ({playersByRole[role].length})
                  </h3>
                  <div className="grid gap-3">
                    {playersByRole[role].map(player => (
                      <div key={player.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                            <img src={player.image} alt={player.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="ml-3">
                            <div className="font-medium">{player.name}</div>
                            <div className="text-sm text-gray-500">{player.university}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm font-medium text-green-600">Rs. {formatNumber(player.budgetLkr || player.budget * 100000000)}</div>
                          <button 
                            onClick={() => handleRemovePlayer(player.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Team completion actions */}
              <div className="mt-8 flex flex-col sm:flex-row justify-between items-center">
                <div>
                  {team.length === 11 ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Team Complete!
                    </span>
                  ) : (
                    <span className="text-gray-500">
                      {11 - team.length} more player{11 - team.length !== 1 ? 's' : ''} needed
                    </span>
                  )}
                </div>
                <button
                  onClick={handleAddMorePlayers}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto mt-4 sm:mt-0"
                >
                  {team.length > 0 ? "Add More Players" : "Select Players"}
                </button>
              </div>

              {/* Team rule information */}
              {team.length > 0 && (
                <div className="mt-6 bg-blue-50 border border-blue-100 rounded-md p-3 text-sm text-gray-700">
                  <p className="mb-1 font-medium text-blue-800">Team Rules:</p>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    <li>Your team must have exactly 11 players to complete</li>
                    <li>Total points are calculated only when the team is complete</li>
                    <li>Initial budget is Rs. {formatNumber(INITIAL_BUDGET_LKR)}</li>
                    <li>You can make changes to your team anytime before the tournament starts</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
