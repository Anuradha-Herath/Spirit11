"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Player categories for selection
const PLAYER_CATEGORIES = [
  { id: "batsman", name: "Batsmen", description: "Select solid batsmen for your team" },
  { id: "bowler", name: "Bowlers", description: "Choose wicket-taking bowlers" },
  { id: "all-rounder", name: "All-Rounders", description: "Add versatile players who can bat and bowl" },
  { id: "wicket-keeper", name: "Wicket Keepers", description: "Pick a reliable wicket keeper" }
];

// Mock players data grouped by category
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [myTeam, setMyTeam] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Load existing team from localStorage
  useEffect(() => {
    const savedTeam = localStorage.getItem("myTeam");
    if (savedTeam) {
      try {
        setMyTeam(JSON.parse(savedTeam));
      } catch (e) {
        console.error("Error loading saved team", e);
      }
    }
  }, []);

  // Save team to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("myTeam", JSON.stringify(myTeam));
  }, [myTeam]);

  const handleAddPlayer = (player: any) => {
    // Check if player is already in the team
    const isPlayerInTeam = myTeam.some(p => p.id === player.id);
    
    if (isPlayerInTeam) {
      alert(`${player.name} is already in your team.`);
      return;
    }
    
    // Check if team size limit reached (11 players)
    if (myTeam.length >= 11) {
      alert("You cannot add more than 11 players to your team.");
      return;
    }
    
    // Add player to team
    setMyTeam([...myTeam, player]);
    alert(`${player.name} added to your team!`);
  };

  const filteredPlayers = selectedCategory 
    ? PLAYERS_BY_CATEGORY[selectedCategory as keyof typeof PLAYERS_BY_CATEGORY].filter(player => 
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.university.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Select Your Team</h1>
      <p className="text-gray-600 mb-6">Choose players from each category to build your dream team.</p>
      
      {/* Team summary bar */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100 flex flex-wrap justify-between items-center">
        <div>
          <h3 className="font-bold">Your Team: {myTeam.length}/11 players selected</h3>
          <p className="text-sm text-gray-600">
            {myTeam.length === 11 
              ? "Team complete! Go to My Team to view details."
              : `Add ${11 - myTeam.length} more players to complete your team.`}
          </p>
        </div>
        <Link href="/dashboard/team" className="mt-2 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
          View My Team
        </Link>
      </div>
      
      {!selectedCategory ? (
        // Category selection cards
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
        // Player selection interface
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {PLAYER_CATEGORIES.find(c => c.id === selectedCategory)?.name}
            </h2>
            <button 
              onClick={() => setSelectedCategory(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Categories
            </button>
          </div>
          
          {/* Search bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search players by name or university..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Players list */}
          <div className="grid gap-4">
            {filteredPlayers.map(player => (
              <div key={player.id} className="bg-white rounded-md shadow flex flex-col sm:flex-row overflow-hidden">
                <div className="sm:w-20 h-20 bg-gray-200 flex-shrink-0">
                  <img 
                    src={player.image}
                    alt={player.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex-grow flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-bold">{player.name}</h3>
                    <p className="text-gray-600 text-sm">{player.university}</p>
                  </div>
                  <div className="mt-2 sm:mt-0 flex items-center gap-4">
                    <span className="text-gray-800 font-medium">${player.budget}M</span>
                    <button
                      onClick={() => handleAddPlayer(player)}
                      disabled={myTeam.some(p => p.id === player.id)}
                      className={`px-4 py-1 rounded text-sm font-medium ${
                        myTeam.some(p => p.id === player.id)
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {myTeam.some(p => p.id === player.id) ? "Added" : "Add to Team"}
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
