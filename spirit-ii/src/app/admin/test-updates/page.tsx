"use client";

import { useState } from "react";
import { adminSocket, ADMIN_EVENTS } from "@/lib/admin-socket";

export default function TestUpdatesPage() {
  const [selectedPlayer, setSelectedPlayer] = useState("1");
  const [runs, setRuns] = useState(10);
  const [wickets, setWickets] = useState(1);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  // Connect the socket when the page loads
  useState(() => {
    adminSocket.connect();
  });

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

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Test Real-Time Updates</h1>
      <p className="mb-6 text-gray-600">
        This page allows you to test the real-time update functionality by triggering various types of events.
        Open another admin page in a separate tab to see the updates reflected without refreshing.
      </p>
      
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
              <option value="1">Kasun Perera (ID: 1)</option>
              <option value="2">Amal Silva (ID: 2)</option>
              <option value="3">Nuwan Pradeep (ID: 3)</option>
              <option value="4">Dinesh Chandimal (ID: 4)</option>
              <option value="5">Lahiru Kumara (ID: 5)</option>
              <option value="6">Kusal Mendis (ID: 6)</option>
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
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <h3 className="font-medium text-yellow-800">Testing Instructions</h3>
          <ul className="list-disc list-inside text-sm text-yellow-700 mt-2 space-y-1">
            <li>Open the Player Stats page or Tournament Summary in another tab</li>
            <li>Trigger updates using the buttons above</li>
            <li>Watch as the data updates in real-time without refreshing the page</li>
            <li>Notifications will appear in the bottom-right corner</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
