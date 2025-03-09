"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { calculatePlayerValue, calculatePlayerPoints } from "@/utils/playerCalculations";
import ImageUploader from "@/components/admin/ImageUploader";

// Available categories for players
const PLAYER_CATEGORIES = ["Batsman", "Bowler", "All-rounder", "Wicket Keeper"];

// Use the same mock data structure with the new field names
const MOCK_PLAYERS_DETAILS = {
  "1": {
    id: "1",
    name: "Kasun Perera",
    university: "University of Moratuwa",
    category: "Batsman",  // Changed from "role"
    budget: 10.5,
    image: "https://via.placeholder.com/300",
    total_runs: 1200,
    balls_faced: 950,
    innings_played: 24,
    wickets: 0,
    overs_bowled: 0,
    runs_conceded: 0
  },
  "2": {
    id: "2",
    name: "Amal Silva",
    university: "University of Colombo",
    category: "Bowler",
    budget: 9.2,
    image: "https://via.placeholder.com/300",
    total_runs: 120,
    balls_faced: 140,
    innings_played: 20,
    wickets: 45,
    overs_bowled: 180,
    runs_conceded: 756
  },
  "3": {
    id: "3",
    name: "Nuwan Pradeep",
    university: "University of Peradeniya",
    category: "All-rounder",
    budget: 11.0,
    image: "https://via.placeholder.com/300",
    total_runs: 450,
    balls_faced: 410,
    innings_played: 18,
    wickets: 30,
    overs_bowled: 150,
    runs_conceded: 770
  },
  "4": {
    id: "4",
    name: "Dinesh Chandimal",
    university: "University of Moratuwa",
    category: "Wicket Keeper",
    budget: 9.8,
    image: "https://via.placeholder.com/300",
    total_runs: 780,
    balls_faced: 620,
    innings_played: 22,
    wickets: 0,
    overs_bowled: 0,
    runs_conceded: 0
  },
  "5": {
    id: "5",
    name: "Lahiru Kumara",
    university: "University of Colombo",
    category: "Bowler",
    budget: 8.5,
    image: "https://via.placeholder.com/300",
    total_runs: 60,
    balls_faced: 80,
    innings_played: 16,
    wickets: 38,
    overs_bowled: 160,
    runs_conceded: 608
  },
  "6": {
    id: "6",
    name: "Kusal Mendis",
    university: "University of Kelaniya",
    category: "Batsman",
    budget: 10.2,
    image: "https://via.placeholder.com/300",
    total_runs: 1150,
    balls_faced: 820,
    innings_played: 25,
    wickets: 0,
    overs_bowled: 0,
    runs_conceded: 0
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
    const numericFields = ['total_runs', 'balls_faced', 'innings_played', 'wickets', 'overs_bowled', 'runs_conceded'];
    
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

  // Add handler for image uploads
  const handleImageUploaded = (url: string) => {
    setPlayer({
      ...player,
      image: url
    });
    
    // Recalculate value and points
    const updatedPlayer = {
      ...player,
      image: url
    };
    
    const value = calculatePlayerValue(updatedPlayer);
    const points = calculatePlayerPoints(updatedPlayer);
    setCalculatedValue(value);
    setCalculatedPoints(points);
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
              {/* Replace the static image with ImageUploader */}
              <label className="block text-sm font-medium text-gray-700 mb-2">Player Image</label>
              <ImageUploader
                initialImage={player.image}
                onImageUpload={handleImageUploaded}
              />
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={player.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {PLAYER_CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
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
            {/* Batting Stats */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4 border-b pb-1">Batting Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Runs</label>
                  <input
                    type="number"
                    name="total_runs"
                    value={player.total_runs || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Balls Faced</label>
                  <input
                    type="number"
                    name="balls_faced"
                    value={player.balls_faced || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Innings Played</label>
                  <input
                    type="number"
                    name="innings_played"
                    value={player.innings_played || ''}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Overs Bowled</label>
                  <input
                    type="number"
                    name="overs_bowled"
                    value={player.overs_bowled || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Runs Conceded</label>
                  <input
                    type="number"
                    name="runs_conceded"
                    value={player.runs_conceded || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    min="0"
                  />
                </div>
              </div>
            </div>
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
