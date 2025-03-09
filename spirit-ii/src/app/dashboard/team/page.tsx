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

  // Calculate total points when team is complete (11 players)
  useEffect(() => {
    if (team.length === 11) {
      const points = calculatePoints();
      setTotalPoints(points);
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
                    Total Points: {totalPoints}
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
                    {playersByRole[role].map((player) => {
                      const playerBudgetLkr = player.budgetLkr || player.budget * 100000000;
                      return (
                        <div key={player.id} className="bg-gray-50 rounded-md p-3 flex flex-col sm:flex-row justify-between">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gray-200 rounded-full mr-3 overflow-hidden">
                              <img 
                                src={player.image} 
                                alt={player.name}
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">{player.name}</h4>
                              <p className="text-gray-600 text-sm">{player.university}</p>
                            </div>
                          </div>
                          <div className="flex items-center mt-3 sm:mt-0 justify-between sm:justify-end w-full sm:w-auto">
                            <span className="text-green-600 font-medium mr-4">Rs. {formatNumber(playerBudgetLkr)}</span>
                            <button
                              onClick={() => handleRemovePlayer(player.id)}
                              className="text-red-500 hover:text-red-700 text-sm font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Team completion actions */}
              <div className="mt-8 flex flex-col sm:flex-row justify-between items-center">
                <div>
                  {team.length < 11 ? (
                    <p className="text-orange-600 mb-2 sm:mb-0">
                      Your team needs {11 - team.length} more player(s) to be complete.
                    </p>
                  ) : (
                    <p className="text-green-600 font-medium mb-2 sm:mb-0">
                      Your team is complete! Total points: {totalPoints}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleAddMorePlayers}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
                >
                  {team.length < 11 ? "Add More Players" : "Edit Team"}
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
