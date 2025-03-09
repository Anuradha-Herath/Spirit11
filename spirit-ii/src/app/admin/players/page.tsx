"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { calculatePlayerValue, calculatePlayerPoints } from "@/utils/playerCalculations";

// Mock player data - in a real app, this would come from your API
const MOCK_PLAYERS = [
  {
    id: "1",
    name: "Kasun Perera",
    university: "University of Moratuwa",
    role: "Batsman",
    image: "https://via.placeholder.com/150",
    matches: 24,
    runs: 1200,
    wickets: 0,
  },
  {
    id: "2",
    name: "Amal Silva",
    university: "University of Colombo",
    role: "Bowler",
    image: "https://via.placeholder.com/150",
    matches: 20,
    runs: 120,
    wickets: 45,
  },
  {
    id: "3",
    name: "Nuwan Pradeep",
    university: "University of Peradeniya",
    role: "All-rounder",
    image: "https://via.placeholder.com/150",
    matches: 18,
    runs: 450,
    wickets: 30,
  },
  {
    id: "4",
    name: "Dinesh Chandimal",
    university: "University of Moratuwa",
    role: "Wicket Keeper",
    image: "https://via.placeholder.com/150",
    matches: 22,
    runs: 780,
    wickets: 0,
    stumpings: 25,
    catches: 32,
  },
  {
    id: "5",
    name: "Lahiru Kumara",
    university: "University of Colombo",
    role: "Bowler",
    image: "https://via.placeholder.com/150",
    matches: 16,
    runs: 60,
    wickets: 38,
  },
  {
    id: "6",
    name: "Kusal Mendis",
    university: "University of Kelaniya",
    role: "Batsman",
    image: "https://via.placeholder.com/150",
    matches: 25,
    runs: 1150,
    wickets: 0,
  },
];

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState(MOCK_PLAYERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlayer, setNewPlayer] = useState({
    name: "",
    university: "",
    role: "Batsman",
    image: "https://via.placeholder.com/150",
    matches: 0,
    runs: 0,
    wickets: 0,
    batting_average: 0,
    batting_strike_rate: 0,
    bowling_average: 0,
    economy: 0
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch players from API
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setIsLoading(true);
        
        // Get auth token from localStorage - in a real app, use a proper auth system
        const userData = localStorage.getItem("user");
        let authHeader = '';
        if (userData) {
          const user = JSON.parse(userData);
          authHeader = `Bearer ${user.username}`; // This is just a simple mock auth header
        }
        
        // Try to fetch from the API route
        try {
          console.log('Fetching players from API...');
          const response = await fetch('/api/admin/players', {
            headers: {
              'Authorization': authHeader
            }
          });
          
          if (!response.ok) {
            console.error('API response not OK:', response.status, response.statusText);
            throw new Error(`Failed to fetch players: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('API request successful, players:', data.length);
          setPlayers(data);
          
        } catch (apiError) {
          console.error('API request failed:', apiError);
          throw apiError; // Re-throw to trigger fallback
        }
      } catch (error) {
        console.warn('Falling back to mock data due to error:', error);
        // Fallback to mock data if API is not available
        setPlayers(MOCK_PLAYERS);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPlayers();
  }, []);

  // Filter and sort players
  const filteredAndSortedPlayers = [...players]
    .filter(player => {
      const matchesSearch = 
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.university.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterRole === "All" || player.role === filterRole;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a: any, b: any) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPlayer({
      ...newPlayer,
      [name]: name === "matches" || name === "runs" || name === "wickets" || 
              name.includes("average") || name.includes("rate") || name === "economy" 
              ? Number(value) 
              : value
    });
  };

  const handleCreatePlayer = async () => {
    try {
      setIsLoading(true);
      
      // Get auth token
      const userData = localStorage.getItem("user");
      let authHeader = '';
      if (userData) {
        const user = JSON.parse(userData);
        authHeader = `Bearer ${user.username}`;
      }
      
      // Call API to create player
      const response = await fetch('/api/admin/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify(newPlayer)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create player');
      }
      
      const createdPlayer = await response.json();
      
      // Update state with new player
      setPlayers([...players, createdPlayer]);
      
      // Reset form
      setNewPlayer({
        name: "",
        university: "",
        role: "Batsman",
        image: "https://via.placeholder.com/150",
        matches: 0,
        runs: 0,
        wickets: 0,
        batting_average: 0,
        batting_strike_rate: 0,
        bowling_average: 0,
        economy: 0
      });
      
      setShowCreateModal(false);
      
      // Show success message
      setSuccessMessage("Player created successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error('Error creating player:', error);
      setSuccessMessage("Error creating player. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePlayer = async (playerId: string) => {
    if (window.confirm("Are you sure you want to delete this player?")) {
      try {
        setIsLoading(true);
        
        // Get auth token
        const userData = localStorage.getItem("user");
        let authHeader = '';
        if (userData) {
          const user = JSON.parse(userData);
          authHeader = `Bearer ${user.username}`;
        }
        
        // Call API to delete player
        const response = await fetch(`/api/admin/players/${playerId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': authHeader
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete player');
        }
        
        // Update state by removing the deleted player
        setPlayers(players.filter(player => player.id !== playerId));
        
        // Show success message
        setSuccessMessage("Player deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        console.error('Error deleting player:', error);
        setSuccessMessage("Error deleting player. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-md animate-fade-in-out">
          {successMessage}
        </div>
      )}

      {/* Create Player Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create New Player</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4 col-span-2 md:col-span-1">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={newPlayer.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">University*</label>
                  <input
                    type="text"
                    name="university"
                    value={newPlayer.university}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role*</label>
                  <select
                    name="role"
                    value={newPlayer.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  >
                    <option value="Batsman">Batsman</option>
                    <option value="Bowler">Bowler</option>
                    <option value="All-rounder">All-rounder</option>
                    <option value="Wicket Keeper">Wicket Keeper</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={newPlayer.image}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
              
              <div className="space-y-4 col-span-2 md:col-span-1">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Matches*</label>
                  <input
                    type="number"
                    name="matches"
                    value={newPlayer.matches}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    min="0"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Runs</label>
                    <input
                      type="number"
                      name="runs"
                      value={newPlayer.runs}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Wickets</label>
                    <input
                      type="number"
                      name="wickets"
                      value={newPlayer.wickets}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Batting Average</label>
                    <input
                      type="number"
                      name="batting_average"
                      value={newPlayer.batting_average}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Strike Rate</label>
                    <input
                      type="number"
                      name="batting_strike_rate"
                      value={newPlayer.batting_strike_rate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bowling Average</label>
                    <input
                      type="number"
                      name="bowling_average"
                      value={newPlayer.bowling_average}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Economy Rate</label>
                    <input
                      type="number"
                      name="economy"
                      value={newPlayer.economy}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePlayer}
                disabled={!newPlayer.name || !newPlayer.university || !newPlayer.role}
                className={`px-4 py-2 rounded text-white ${
                  !newPlayer.name || !newPlayer.university || !newPlayer.role
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                Create Player
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Players Management</h1>
          <Link 
            href="/admin/players/new"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Player
          </Link>
        </div>
        
        {/* Search and filter controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="col-span-1 md:col-span-2">
            <input
              type="text"
              placeholder="Search players by name or university..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="All">All Roles</option>
              <option value="Batsman">Batsman</option>
              <option value="Bowler">Bowler</option>
              <option value="All-rounder">All-rounder</option>
              <option value="Wicket Keeper">Wicket Keeper</option>
            </select>
          </div>
        </div>
        
        {/* Players table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                  Player {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('university')}>
                  University {sortField === 'university' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('role')}>
                  Role {sortField === 'role' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('matches')}>
                  Matches {sortField === 'matches' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('runs')}>
                  Runs {sortField === 'runs' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('wickets')}>
                  Wickets {sortField === 'wickets' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value (LKR)
                </th>
                <th className="py-3 px-4 border-b border-gray-200 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAndSortedPlayers.map((player) => {
                // Calculate dynamic value and points
                const playerValue = player.budget ? player.budget * 100000000 : calculatePlayerValue(player);
                const playerPoints = calculatePlayerPoints(player);
                
                return (
                  <tr key={player.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                          <img src={player.image} alt={player.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{player.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                      {player.university}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        player.role === 'Batsman' ? 'bg-green-100 text-green-800' :
                        player.role === 'Bowler' ? 'bg-red-100 text-red-800' :
                        player.role === 'All-rounder' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {player.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                      {player.matches}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                      {player.runs}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                      {player.wickets}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-green-600">
                      Rs. {playerValue.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      <Link 
                        href={`/admin/players/${player.id}`}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        View
                      </Link>
                      <Link 
                        href={`/admin/players/${player.id}/edit`}
                        className="text-purple-600 hover:text-purple-900 mr-4"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDeletePlayer(player.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
              
              {filteredAndSortedPlayers.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-4 px-4 text-center text-gray-500">
                    No players found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}