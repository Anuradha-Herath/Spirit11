"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/admin/ImageUploader";

// Available categories for players
const PLAYER_CATEGORIES = ["Batsman", "Bowler", "All-rounder", "Wicket Keeper"];

// List of universities for dropdown
const UNIVERSITIES = [
  "University of Colombo",
  "University of Peradeniya",
  "University of Sri Jayewardenepura",
  "University of Kelaniya",
  "University of Moratuwa",
  "University of Jaffna",
  "University of Ruhuna",
  "Eastern University",
  "South Eastern University",
  "Rajarata University",
  "Sabaragamuwa University",
  "Wayamba University",
  "Uva Wellassa University",
  "University of the Visual & Performing Arts"
];

export default function NewPlayerPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [formRendered, setFormRendered] = useState(false);
  
  // Player form state with only required fields
  const [player, setPlayer] = useState({
    name: "",
    university: UNIVERSITIES[0],
    category: PLAYER_CATEGORIES[0],
    image: "",
    total_runs: 0,
    balls_faced: 0,
    innings_played: 0,
    wickets: 0,
    overs_bowled: 0,
    runs_conceded: 0
  });
  
  useEffect(() => {
    console.log("Form component rendered");
    setFormRendered(true);
  }, []);
  
  // Handle standard form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Convert numeric fields to numbers
    const numericFields = ["total_runs", "balls_faced", "innings_played", "wickets", "overs_bowled", "runs_conceded"];
    
    const processedValue = numericFields.includes(name) 
      ? value === "" ? 0 : Number(value)
      : value;
    
    console.log(`Field ${name} changed to: ${value}`);
    
    setPlayer({
      ...player,
      [name]: processedValue
    });
  };
  
  // Handle image upload completion
  const handleImageUploaded = (url: string) => {
    setImageUrl(url);
    setPlayer({
      ...player,
      image: url
    });
  };
  
  // Submit form to create new player
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with data:", player);
    setIsSubmitting(true);
    setError("");
    
    // Validate form
    if (!player.name || !player.university || !player.category) {
      setError("Name, university and category are required");
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Get auth token from localStorage
      const userData = localStorage.getItem("user");
      let authHeader = "";
      if (userData) {
        const user = JSON.parse(userData);
        authHeader = `Bearer ${user.username}`;
      }
      
      // Send player data to API
      const response = await fetch("/api/admin/players", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authHeader
        },
        body: JSON.stringify(player)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create player");
      }
      
      const newPlayer = await response.json();
      
      // Show success message
      setSuccessMessage("Player created successfully!");
      
      // Redirect to player details page after a short delay
      setTimeout(() => {
        router.push(`/admin/players/${newPlayer.id}`);
      }, 1500);
      
    } catch (err) {
      console.error("Error creating player:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    router.back();
  };

  if (!formRendered) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
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
          <h1 className="text-xl font-bold">Create New Player</h1>
          <div className="w-20"></div> {/* Spacer for balance */}
        </div>
      </div>
      
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out">
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Basic Info & Image */}
          <div>
            <div className="mb-6">
              {/* Image Uploader Component */}
              <label className="block text-sm font-medium text-gray-700 mb-2">Player Image</label>
              <ImageUploader 
                initialImage={imageUrl}
                onImageUpload={handleImageUploaded}
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={player.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">University *</label>
                <select
                  name="university"
                  value={player.university}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  {UNIVERSITIES.map((uni) => (
                    <option key={uni} value={uni}>{uni}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  name="category"
                  value={player.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  {PLAYER_CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
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
                    value={player.total_runs}
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
                    value={player.balls_faced}
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
                    value={player.innings_played}
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
                    value={player.wickets}
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
                    value={player.overs_bowled}
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
                    value={player.runs_conceded}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 text-red-500">{error}</div>
        )}
        
        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Player"}
          </button>
        </div>
      </form>
    </div>
  );
}
