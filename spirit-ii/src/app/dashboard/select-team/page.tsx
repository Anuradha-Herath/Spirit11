"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTeam, INITIAL_BUDGET_LKR } from '@/contexts/TeamContext';
import { eventService, EVENTS } from '@/lib/event-service';

// Format number to display with commas
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-LK').format(num);
};

// Convert budget from millions to LKR
const convertToLKR = (budgetInMillions: number) => {
  return budgetInMillions * 100000000; // 1M USD = 100M LKR (simplified for this example)
};

// Player categories for selection
const PLAYER_CATEGORIES = [
  { id: "batsman", name: "Batsmen", description: "Select solid batsmen for your team" },
  { id: "bowler", name: "Bowlers", description: "Choose wicket-taking bowlers" },
  { id: "all-rounder", name: "All-Rounders", description: "Add versatile players who can bat and bowl" },
  { id: "wicket-keeper", name: "Wicket Keepers", description: "Pick a reliable wicket keeper" }
];

// Mock players data with budgets in millions (to be converted to LKR)
const PLAYERS_BY_CATEGORY = {
  "batsman": [
    {
      id: "1",
      name: "Kasun Perera",
      university: "University of Moratuwa",
      role: "Batsman",
      budget: 10.5,
      image: "https://via.placeholder.com/150"
    },
    {
      id: "6",
      name: "Kusal Mendis",
      university: "University of Kelaniya",
      role: "Batsman",
      budget: 10.2,
      image: "https://via.placeholder.com/150"
    },
    {
      id: "7",
      name: "Pathum Nissanka",
      university: "University of Jaffna",
      role: "Batsman",
      budget: 9.8,
      image: "https://via.placeholder.com/150"
    },
    {
      id: "8",
      name: "Avishka Fernando",
      university: "University of Colombo",
      role: "Batsman",
      budget: 9.5,
      image: "https://via.placeholder.com/150"
    }
  ],
  "bowler": [
    {
      id: "2",
      name: "Amal Silva",
      university: "University of Colombo",
      role: "Bowler",
      budget: 9.2,
      image: "https://via.placeholder.com/150"
    },
    {
      id: "5",
      name: "Lahiru Kumara",
      university: "University of Colombo",
      role: "Bowler",
      budget: 8.5,
      image: "https://via.placeholder.com/150"
    },
    {
      id: "9",
      name: "Dilshan Madushanka",
      university: "University of Ruhuna",
      role: "Bowler",
      budget: 8.8,
      image: "https://via.placeholder.com/150"
    },
    {
      id: "10",
      name: "Wanindu Hasaranga",
      university: "University of Sri Jayawardenepura",
      role: "Bowler",
      budget: 11.0,
      image: "https://via.placeholder.com/150"
    }
  ],
  "all-rounder": [
    {
      id: "3",
      name: "Nuwan Pradeep",
      university: "University of Peradeniya",
      role: "All-rounder",
      budget: 11.0,
      image: "https://via.placeholder.com/150"
    },
    {
      id: "11",
      name: "Charith Asalanka",
      university: "University of Kelaniya",
      role: "All-rounder",
      budget: 9.7,
      image: "https://via.placeholder.com/150"
    },
    {
      id: "12",
      name: "Dasun Shanaka",
      university: "University of Moratuwa",
      role: "All-rounder",
      budget: 10.3,
      image: "https://via.placeholder.com/150"
    }
  ],
  "wicket-keeper": [
    {
      id: "4",
      name: "Dinesh Chandimal",
      university: "University of Moratuwa",
      role: "Wicket Keeper",
      budget: 9.8,
      image: "https://via.placeholder.com/150"
    },
    {
      id: "13",
      name: "Kusal Perera",
      university: "University of Colombo",
      role: "Wicket Keeper",
      budget: 10.1,
      image: "https://via.placeholder.com/150"
    }
  ]
};

export default function SelectTeamPage() {
  const { team, addPlayer, remainingBudget } = useTeam();
  const [allPlayers, setAllPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setIsLoading(true);
        setError("");
        
        // Get auth token from localStorage for authenticated requests
        const userData = localStorage.getItem("user");
        let authHeader = '';
        if (userData) {
          const user = JSON.parse(userData);
          authHeader = `Bearer ${user.username}`; // Use proper token in production
        }
        
        const response = await fetch('/api/players', {
          headers: {
            'Authorization': authHeader
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch players: ${response.status}`);
        }
        
        const data = await response.json();
        setAllPlayers(data);
      } catch (err) {
        console.error("Error fetching players:", err);
        setError("Failed to load players. Using demo data instead.");
        // Fallback to mock data
        setAllPlayers(MOCK_PLAYERS);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPlayers();
  }, []);

  // Show notification and auto-hide after 3 seconds
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddPlayer = (player: any) => {
    // Check if player is already in the team
    if (team.some(p => p.id === player.id)) {
      showNotification(`${player.name} is already in your team.`, 'error');
      return;
    }
    
    // Check if team size limit reached
    if (team.length >= 11) {
      showNotification("You cannot add more than 11 players to your team.", 'error');
      return;
    }
    
    // Check budget and add player using the context
    const playerBudgetLkr = convertToLKR(player.budget);
    if (playerBudgetLkr > remainingBudget) {
      showNotification(
        `Cannot afford ${player.name}. Required: Rs. ${formatNumber(playerBudgetLkr)}`,
        'error'
      );
      return;
    }
    
    const success = addPlayer(player);
    if (success) {
      showNotification(`${player.name} added to your team!`, 'success');
      
      // Publish player-specific update for real-time reflection
      eventService.publish(EVENTS.PLAYER_STATS_UPDATED, { playerId: player.id });
    }
  };

  // Ensure players array is defined before filtering
  const safePlayers = allPlayers || [];
  const filteredPlayers = selectedCategory 
    ? safePlayers.filter(player => 
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.university.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="relative">
      {/* Notification toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white animate-fade-in-out`}>
          {notification.message}
        </div>
      )}
      
      <h1 className="text-2xl font-bold mb-2">Select Your Team</h1>
      <p className="text-gray-600 mb-6">Choose players from each category to build your dream team.</p>
      
      {/* Budget and Team summary bar */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h3 className="font-bold mb-1">Your Team: {team.length}/11 players selected</h3>
            <p className="text-sm text-gray-600">
              {team.length === 11 
                ? "Team complete! Go to My Team to view details."
                : `Add ${11 - team.length} more players to complete your team.`}
            </p>
          </div>
          <div className="mt-3 md:mt-0 flex flex-col items-end">
            <div className="text-lg font-bold text-green-700">Budget: Rs. {formatNumber(remainingBudget)}</div>
            <p className="text-sm text-gray-600">Initial: Rs. {formatNumber(INITIAL_BUDGET_LKR)}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Link href="/dashboard/team" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
            View My Team
          </Link>
        </div>
      </div>
      
      {!selectedCategory ? (
        // Category selection cards - responsive grid
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {PLAYER_CATEGORIES.map(category => (
            <div 
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500"
            >
              <h3 className="text-xl font-bold mb-2">{category.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{category.description}</p>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                Select Players →
              </button>
            </div>
          ))}
        </div>
      ) : (
        // Player selection interface with improved responsiveness
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h2 className="text-xl font-bold">
              {PLAYER_CATEGORIES.find(c => c.id === selectedCategory)?.name}
            </h2>
            <button 
              onClick={() => setSelectedCategory(null)}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <span className="mr-1">←</span> Back to Categories
            </button>
          </div>
          
          {/* Search bar with improved responsiveness */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search players by name or university..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Players list with responsive design and LKR currency */}
          <div className="space-y-4">
            {filteredPlayers.map(player => (
              <div key={player.id} className="bg-white rounded-md shadow flex flex-col sm:flex-row overflow-hidden">
                <div className="w-full sm:w-20 h-40 sm:h-auto bg-gray-200 flex-shrink-0">
                  <img 
                    src={player.image}
                    alt={player.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold">{player.name}</h3>
                    <p className="text-gray-600 text-sm">{player.university}</p>
                    <p className="text-gray-500 text-sm mt-1">{player.role}</p>
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className={`font-medium ${convertToLKR(player.budget) > remainingBudget ? 'text-red-600' : 'text-gray-800'}`}>
                      Rs. {formatNumber(convertToLKR(player.budget))}
                    </span>
                    <button
                      onClick={() => handleAddPlayer(player)}
                      disabled={team.some(p => p.id === player.id) || convertToLKR(player.budget) > remainingBudget}
                      className={`px-4 py-2 rounded text-sm font-medium ${
                        team.some(p => p.id === player.id)
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : convertToLKR(player.budget) > remainingBudget
                          ? "bg-red-200 text-red-700 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {team.some(p => p.id === player.id) 
                        ? "Added" 
                        : convertToLKR(player.budget) > remainingBudget 
                        ? "Can't Afford" 
                        : "Add to Team"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredPlayers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No players found matching your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
