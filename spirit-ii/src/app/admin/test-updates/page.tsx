"use client";

import { useState, useEffect } from "react";
import { adminSocket, ADMIN_EVENTS } from "@/lib/admin-socket";

export default function TestUpdatesPage() {
  const [updates, setUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPlayer, setSelectedPlayer] = useState("1");
  const [runs, setRuns] = useState(10);
  const [wickets, setWickets] = useState(1);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);
  const [availablePlayers, setAvailablePlayers] = useState<any[]>([]);

  // Connect the socket when the page loads
  useEffect(() => {
    adminSocket.connect();
    return () => {
      // Clean up on unmount
      adminSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        setLoading(true);
        setErrorMessage("");
        
        // Get auth token from localStorage
        const userData = localStorage.getItem("user");
        let authHeader = "";
        if (userData) {
          const user = JSON.parse(userData);
          authHeader = `Bearer ${user.username}`;
        }
        
        const response = await fetch("/api/admin/test-updates", {
          headers: { "Authorization": authHeader },
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch updates: ${response.status}`);
        }
        
        const data = await response.json();
        setUpdates(data);
      } catch (error) {
        console.error("Error fetching updates:", error);
        setErrorMessage("Failed to load updates. Using mock data instead.");
        
        // Use mock data as fallback
        setUpdates(getMockUpdates());
      } finally {
        setLoading(false);
      }
    };

    const fetchPlayers = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        // Get auth token from localStorage
        const userData = localStorage.getItem("user");
        let authHeader = "";
        if (userData) {
          const user = JSON.parse(userData);
          authHeader = `Bearer ${user.username}`;
        }

        const response = await fetch("/api/players", {
          headers: { "Authorization": authHeader },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch players: ${response.status}`);
        }

        const data = await response.json();
        setAvailablePlayers(data);
      } catch (error) {
        console.error("Error fetching players:", error);
        setErrorMessage("Failed to load players. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
    fetchPlayers();
  }, []);

  const triggerPlayerUpdate = () => {
    adminSocket.emit(ADMIN_EVENTS.PLAYER_UPDATED, {
      playerId: selectedPlayer,
      name: `Player ${selectedPlayer}`,
      timestamp: new Date().toISOString()
    });
    
    showUpdateMessage("Player update triggered");
  };

  const triggerStatsUpdate = () => {
    adminSocket.emit(ADMIN_EVENTS.STATS_UPDATED, {
      playerId: selectedPlayer,
      timestamp: new Date().toISOString(),
      stats: {
        runs: parseInt(runs.toString()),
        wickets: parseInt(wickets.toString())
      }
    });
    
    showUpdateMessage("Stats update triggered");
  };

  const triggerTournamentUpdate = () => {
    const randomPercentage = Math.floor(Math.random() * 20) + 60; // 60-80%
    
    adminSocket.emit(ADMIN_EVENTS.TOURNAMENT_UPDATED, {
      completed_percentage: randomPercentage,
      total_matches: 15 + Math.floor(Math.random() * 5),
      type: "Progress Update",
      timestamp: new Date().toISOString()
    });
    
    showUpdateMessage("Tournament update triggered");
  };

  const showUpdateMessage = (message: string) => {
    setUpdateMessage(message);
    setTimeout(() => setUpdateMessage(null), 3000);
  };

  // Filter updates by type if needed
  const filteredUpdates = selectedType === 'all' 
    ? updates 
    : updates.filter(update => update.type === selectedType);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Test Real-Time Updates</h1>
      
      {errorMessage && (
        <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-yellow-700">{errorMessage}</p>
        </div>
      )}
      
      {updateMessage && (
        <div className="bg-green-100 text-green-800 p-3 rounded-md mb-6">
          {updateMessage}
        </div>
      )}
      
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-medium mb-4">Player Selection</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Player</label>
            <select
              value={selectedPlayer}
              onChange={(e) => setSelectedPlayer(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {availablePlayers.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name} (ID: {player.id})
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-lg font-medium mb-4">Update Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Runs to Add</label>
              <input
                type="number"
                value={runs}
                onChange={(e) => setRuns(parseInt(e.target.value) || 0)}
                min="0"
                max="200"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Wickets to Add</label>
              <input
                type="number"
                value={wickets}
                onChange={(e) => setWickets(parseInt(e.target.value) || 0)}
                min="0"
                max="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <button
            onClick={triggerStatsUpdate}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Player Statistics
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={triggerPlayerUpdate}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Trigger Player Update
          </button>
          <button
            onClick={triggerTournamentUpdate}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Trigger Tournament Update
          </button>
        </div>
        
        {/* Update History */}
        <div className="mt-8">
          <h2 className="text-lg font-medium mb-4 flex justify-between items-center">
            <span>Update History</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-sm px-2 py-1 border border-gray-300 rounded"
            >
              <option value="all">All Types</option>
              <option value="stats">Stats</option>
              <option value="player">Player</option>
              <option value="tournament">Tournament</option>
              <option value="match">Match</option>
            </select>
          </h2>
          
          {filteredUpdates.length > 0 ? (
            <div className="space-y-4">
              {filteredUpdates.map((update) => (
                <div key={update.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-lg">{update.title}</h3>
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      {update.type || "general"}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">{update.message}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    {new Date(update.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded">
              No update history available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function for mock updates
function getMockUpdates() {
  const now = new Date();
  
  return [
    {
      id: "1",
      title: "Player Statistics Updated",
      message: "Several player statistics have been updated based on recent match performance.",
      timestamp: new Date(now.getTime() - 1000 * 60 * 30), // 30 minutes ago
      type: "stats"
    },
    {
      id: "2",
      title: "Tournament Progress",
      message: "Tournament has reached the 65% completion mark.",
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 2), // 2 hours ago
      type: "tournament" 
    },
    {
      id: "3",
      title: "New Player Added",
      message: "A new bowler from University of Ruhuna has been added to the player database.",
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 5), // 5 hours ago
      type: "player"
    }
  ];
}
