"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Mock point calculation function (simulating the backend logic)
// This would be replaced by your actual points calculation logic
const calculatePlayerPoints = (player: any) => {
  // In a real implementation, points would be calculated based on player stats
  // but here we're using a random value as a demonstration
  return Math.floor(Math.random() * 80) + 20; // Random points between 20-100
};

export default function TeamPage() {
  const [myTeam, setMyTeam] = useState<any[]>([]);
  const [totalPoints, setTotalPoints] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Load team from localStorage
    const savedTeam = localStorage.getItem("myTeam");
    if (savedTeam) {
      try {
        setMyTeam(JSON.parse(savedTeam));
      } catch (e) {
        console.error("Error loading saved team", e);
      }
    }
  }, []);

  // Calculate total points when team is complete (11 players)
  useEffect(() => {
    if (myTeam.length === 11) {
      // Calculate points for each player and sum them
      const points = myTeam.reduce((total, player) => {
        return total + calculatePlayerPoints(player);
      }, 0);
      
      setTotalPoints(points);
    } else {
      setTotalPoints(null);
    }
  }, [myTeam]);

  const handleRemovePlayer = (playerId: string) => {
    const updatedTeam = myTeam.filter(player => player.id !== playerId);
    setMyTeam(updatedTeam);
    localStorage.setItem("myTeam", JSON.stringify(updatedTeam));
  };

  const handleAddMorePlayers = () => {
    router.push("/dashboard/select-team");
  };
  
  // Group players by role for better organization
  const playersByRole: Record<string, any[]> = myTeam.reduce((acc, player) => {
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
    <div>
      <h1 className="text-2xl font-bold mb-2">My Team</h1>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        {/* Team header */}
        <div className="bg-blue-600 text-white p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-xl font-bold">Team Status: {myTeam.length}/11 Players</h2>
              <p className="text-sm text-blue-100">
                {myTeam.length === 11 
                  ? "Team complete!"
                  : `Add ${11 - myTeam.length} more players to complete your team.`}
              </p>
            </div>
            {totalPoints !== null && (
              <div className="mt-2 md:mt-0 bg-yellow-400 text-blue-900 px-4 py-2 rounded-md font-bold">
                Total Points: {totalPoints}
              </div>
            )}
          </div>
        </div>
        
        {/* Team content */}
        <div className="p-4">
          {myTeam.length === 0 ? (
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
                    {playersByRole[role].map((player) => (
                      <div key={player.id} className="bg-gray-50 rounded-md p-3 flex justify-between items-center">
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
                        <div className="flex items-center">
                          <span className="text-gray-700 font-medium mr-4">${player.budget}M</span>
                          <button
                            onClick={() => handleRemovePlayer(player.id)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
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
                  {myTeam.length < 11 ? (
                    <p className="text-orange-600 mb-2 sm:mb-0">
                      Your team needs {11 - myTeam.length} more player(s) to be complete.
                    </p>
                  ) : (
                    <p className="text-green-600 font-medium mb-2 sm:mb-0">
                      Your team is complete! Total points: {totalPoints}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleAddMorePlayers}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {myTeam.length < 11 ? "Add More Players" : "Edit Team"}
                </button>
              </div>

              {/* Team rule information */}
              {myTeam.length > 0 && (
                <div className="mt-6 bg-blue-50 border border-blue-100 rounded-md p-3 text-sm text-gray-700">
                  <p className="mb-1 font-medium text-blue-800">Team Rules:</p>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    <li>Your team must have exactly 11 players to complete</li>
                    <li>Total points are calculated only when the team is complete</li>
                    <li>Points are calculated based on player performance stats</li>
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
