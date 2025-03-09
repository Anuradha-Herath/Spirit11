"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { calculatePlayerValue, calculatePlayerPoints } from "@/utils/playerCalculations";
import Link from "next/link";

// Using the same mock data from the player stats page
const MOCK_PLAYERS_DETAILS = {
  // ...existing code from player stats page...
  "1": {
    id: "1",
    name: "Kasun Perera",
    university: "University of Moratuwa",
    role: "Batsman",
    budget: 10.5,
    image: "https://via.placeholder.com/300",
    age: 23,
    matches: 24,
    runs: 1200,
    batting_average: 45.5,
    batting_strike_rate: 135.8,
    high_score: 98,
    centuries: 0,
    fifties: 12,
    wickets: 0,
    bowling_average: null,
    economy: null,
    bio: "Kasun is a talented top-order batsman known for his elegant stroke play and ability to play long innings."
  },
  "2": {
    id: "2",
    name: "Amal Silva",
    university: "University of Colombo",
    role: "Bowler",
    budget: 9.2,
    image: "https://via.placeholder.com/300",
    age: 22,
    matches: 20,
    runs: 120,
    batting_average: 12.3,
    batting_strike_rate: 85.6,
    high_score: 22,
    centuries: 0,
    fifties: 0,
    wickets: 45,
    bowling_average: 21.5,
    economy: 4.2,
    bio: "Amal is a right-arm fast bowler known for his ability to swing the ball both ways."
  },
  "3": {
    id: "3",
    name: "Nuwan Pradeep",
    university: "University of Peradeniya",
    role: "All-rounder",
    budget: 11.0,
    image: "https://via.placeholder.com/300",
    age: 24,
    matches: 18,
    runs: 450,
    batting_average: 32.1,
    batting_strike_rate: 110.3,
    high_score: 75,
    centuries: 0,
    fifties: 3,
    wickets: 30,
    bowling_average: 25.8,
    economy: 5.1,
    bio: "Nuwan is a versatile all-rounder who can contribute in all departments of the game."
  },
  "4": {
    id: "4",
    name: "Dinesh Chandimal",
    university: "University of Moratuwa",
    role: "Wicket Keeper",
    budget: 9.8,
    image: "https://via.placeholder.com/300",
    age: 23,
    matches: 22,
    runs: 780,
    batting_average: 38.7,
    batting_strike_rate: 125.2,
    high_score: 87,
    centuries: 0,
    fifties: 6,
    wickets: 0,
    bowling_average: null,
    economy: null,
    stumping: 25,
    catches: 32,
    bio: "Dinesh is an agile wicket-keeper with quick reflexes and good game awareness."
  },
  "5": {
    id: "5",
    name: "Lahiru Kumara",
    university: "University of Colombo",
    role: "Bowler",
    budget: 8.5,
    image: "https://via.placeholder.com/300",
    age: 22,
    matches: 16,
    runs: 60,
    batting_average: 8.4,
    batting_strike_rate: 75.2,
    high_score: 18,
    centuries: 0,
    fifties: 0,
    wickets: 38,
    bowling_average: 19.3,
    economy: 3.8,
    bio: "Lahiru is a skilled spinner who can turn the ball sharply."
  },
  "6": {
    id: "6",
    name: "Kusal Mendis",
    university: "University of Kelaniya",
    role: "Batsman",
    budget: 10.2,
    image: "https://via.placeholder.com/300",
    age: 24,
    matches: 25,
    runs: 1150,
    batting_average: 42.8,
    batting_strike_rate: 140.2,
    high_score: 105,
    centuries: 1,
    fifties: 9,
    wickets: 0,
    bowling_average: null,
    economy: null,
    bio: "Kusal is an explosive opening batsman who can set the tone for the innings."
  }
};

export default function EditPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [calculatedValue, setCalculatedValue] = useState(0);
  const [calculatedPoints, setCalculatedPoints] = useState(0);

  useEffect(() => {
    // Get player ID from URL params
    const playerId = params.id as string;
    
    const fetchPlayer = async () => {
      try {
        setLoading(true);
        
        // Get auth token
        const userData = localStorage.getItem("user");
        let authHeader = '';
        if (userData) {
          const user = JSON.parse(userData);
          authHeader = `Bearer ${user.username}`;
        }
        
        console.log("Fetching player with ID:", playerId);
        
        // Call API to get player details
        const response = await fetch(`/api/admin/players/${playerId}`, {
          headers: {
            'Authorization': authHeader
          }
        });
        
        if (!response.ok) {
          console.error("API error:", response.status, response.statusText);
          throw new Error(`Failed to fetch player: ${response.status}`);
        }
        
        const playerData = await response.json();
        console.log("Player data received:", playerData);
        
        // Ensure player has an id (some APIs might return _id from MongoDB)
        if (playerData._id && !playerData.id) {
          playerData.id = playerData._id.toString();
        }
        
        setPlayer(playerData);
        
        // Calculate initial values
        const value = calculatePlayerValue(playerData);
        const points = calculatePlayerPoints(playerData);
        setCalculatedValue(value);
        setCalculatedPoints(points);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching player:', error);
        
        // Fallback to mock data
        console.log("Falling back to mock data");
        if (MOCK_PLAYERS_DETAILS[playerId as keyof typeof MOCK_PLAYERS_DETAILS]) {
          const playerData = MOCK_PLAYERS_DETAILS[playerId as keyof typeof MOCK_PLAYERS_DETAILS];
          setPlayer({...playerData});
          
          // Calculate initial values
          const value = calculatePlayerValue(playerData);
          const points = calculatePlayerPoints(playerData);
          setCalculatedValue(value);
          setCalculatedPoints(points);
        } else {
          setError("Player not found");
        }
        setLoading(false);
      }
    };
    
    fetchPlayer();
  }, [params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric fields
    const numericFields = ['age', 'matches', 'runs', 'wickets', 'batting_average', 'batting_strike_rate', 
      'high_score', 'centuries', 'fifties', 'bowling_average', 'economy', 'stumping', 'catches'];
    
    const updatedValue = numericFields.includes(name) ? 
      (value === '' ? null : Number(value)) : 
      value;

    setPlayer({
      ...player,
      [name]: updatedValue
    });
    
    // Recalculate value and points as user edits
    setTimeout(() => {
      const updatedPlayer = {
        ...player,
        [name]: updatedValue
      };
      
      const value = calculatePlayerValue(updatedPlayer);
      const points = calculatePlayerPoints(updatedPlayer);
      setCalculatedValue(value);
      setCalculatedPoints(points);
    }, 100);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Update the budget based on the newly calculated value
      const updatedPlayer = {
        ...player,
        budget: calculatedValue / 100000000 // Convert LKR to millions for display
      };
      
      // Get auth token
      const userData = localStorage.getItem("user");
      let authHeader = '';
      if (userData) {
        const user = JSON.parse(userData);
        authHeader = `Bearer ${user.username}`;
      }
      
      console.log("Updating player:", updatedPlayer);
      
      // Call API to update player
      const response = await fetch(`/api/admin/players/${player.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify(updatedPlayer)
      });
      
      if (!response.ok) {
        console.error("API error:", response.status, response.statusText);
        throw new Error(`Failed to update player: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Update result:", result);
      
      // Show success message
      setSuccessMessage("Player updated successfully!");
      
      // Wait a moment then redirect back to player view
      setTimeout(() => {
        router.push(`/admin/players/${player.id}`);
      }, 1500);
    } catch (error) {
      console.error('Error updating player:', error);
      setSuccessMessage("Error updating player. Please try again.");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-red-600">{error || "Player not found"}</h1>
        <button 
          onClick={handleCancel}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Back to Players
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out">
          {successMessage}
        </div>
      )}
      
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white p-4">
        <div className="flex justify-between items-center">
          <button 
            onClick={handleCancel}
            className="text-white hover:text-yellow-400 flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Cancel
          </button>
          <h1 className="text-xl font-bold">Edit Player: {player.name}</h1>
          <button 
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
          >
            Save Changes
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Basic Info & Image */}
          <div>
            <div className="mb-6">
              <img 
                src={player.image} 
                alt={player.name}
                className="w-full h-auto rounded-lg" 
              />
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={player.image}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={player.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                <input
                  type="text"
                  name="university"
                  value={player.university}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  name="role"
                  value={player.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Batsman">Batsman</option>
                  <option value="Bowler">Bowler</option>
                  <option value="All-rounder">All-rounder</option>
                  <option value="Wicket Keeper">Wicket Keeper</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  type="number"
                  name="age"
                  value={player.age || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  min="16"
                  max="40"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={player.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            {/* Automatically Calculated Values */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium mb-2">Calculated Values</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Market Value</div>
                  <div className="text-xl font-bold text-green-600">Rs. {calculatedValue.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Fantasy Points</div>
                  <div className="text-xl font-bold text-indigo-600">{calculatedPoints} pts</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">These values are automatically calculated based on player statistics.</p>
            </div>
          </div>
          
          {/* Right Column - Stats */}
          <div>
            {/* Basic Stats */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4 border-b pb-1">Basic Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Matches Played</label>
                  <input
                    type="number"
                    name="matches"
                    value={player.matches || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">High Score</label>
                  <input
                    type="number"
                    name="high_score"
                    value={player.high_score || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    min="0"
                  />
                </div>
              </div>
            </div>
            
            {/* Batting Stats */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4 border-b pb-1">Batting Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Runs</label>
                  <input
                    type="number"
                    name="runs"
                    value={player.runs || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batting Average</label>
                  <input
                    type="number"
                    name="batting_average"
                    value={player.batting_average || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Strike Rate</label>
                  <input
                    type="number"
                    name="batting_strike_rate"
                    value={player.batting_strike_rate || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Centuries</label>
                  <input
                    type="number"
                    name="centuries"
                    value={player.centuries || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fifties</label>
                  <input
                    type="number"
                    name="fifties"
                    value={player.fifties || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    min="0"
                  />
                </div>
              </div>
            </div>
            
            {/* Bowling Stats */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4 border-b pb-1">Bowling Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Wickets</label>
                  <input
                    type="number"
                    name="wickets"
                    value={player.wickets || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bowling Average</label>
                  <input
                    type="number"
                    name="bowling_average"
                    value={player.bowling_average || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Economy Rate</label>
                  <input
                    type="number"
                    name="economy"
                    value={player.economy || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
            
            {/* Wicket-keeping Stats */}
            {player.role === 'Wicket Keeper' && (
              <div>
                <h3 className="text-lg font-medium mb-4 border-b pb-1">Wicket-Keeping Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catches</label>
                    <input
                      type="number"
                      name="catches"
                      value={player.catches || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stumpings</label>
                    <input
                      type="number"
                      name="stumping"
                      value={player.stumping || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
