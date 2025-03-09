"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Mock player data - replace with actual API call
const MOCK_PLAYERS = [
  {
    id: "1",
    name: "Kasun Perera",
    university: "University of Moratuwa",
    role: "Batsman",
    image: "https://via.placeholder.com/150",
    matches: 24,
    batting_average: 45.5,
    bowling_average: null,
    economy: null,
  },
  {
    id: "2",
    name: "Amal Silva",
    university: "University of Colombo",
    role: "Bowler",
    image: "https://via.placeholder.com/150",
    matches: 20,
    batting_average: 12.3,
    bowling_average: 21.5,
    economy: 4.2,
  },
  {
    id: "3",
    name: "Nuwan Pradeep",
    university: "University of Peradeniya",
    role: "All-rounder",
    image: "https://via.placeholder.com/150",
    matches: 18,
    batting_average: 32.1,
    bowling_average: 25.8,
    economy: 5.1,
  },
  {
    id: "4",
    name: "Dinesh Chandimal",
    university: "University of Moratuwa",
    role: "Wicket Keeper",
    image: "https://via.placeholder.com/150",
    matches: 22,
    batting_average: 38.7,
    bowling_average: null,
    economy: null,
  },
  {
    id: "5",
    name: "Lahiru Kumara",
    university: "University of Colombo",
    role: "Bowler",
    image: "https://via.placeholder.com/150",
    matches: 16,
    batting_average: 8.4,
    bowling_average: 19.3,
    economy: 3.8,
  },
  {
    id: "6",
    name: "Kusal Mendis",
    university: "University of Kelaniya",
    role: "Batsman",
    image: "https://via.placeholder.com/150",
    matches: 25,
    batting_average: 42.8,
    bowling_average: null,
    economy: null,
  },
];

export default function PlayersPage() {
  const [players, setPlayers] = useState(MOCK_PLAYERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");

  const roles = ["All", "Batsman", "Bowler", "All-rounder", "Wicket Keeper"];

  // Filter players based on search term and role filter
  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          player.university.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "All" || player.role === filter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Players</h1>
      
      {/* Search and filter section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search by name or university..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {roles.map(role => (
            <button
              key={role}
              onClick={() => setFilter(role)}
              className={`px-4 py-2 rounded-md whitespace-nowrap ${
                filter === role
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>
      
      {/* Players grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPlayers.map(player => (
          <Link href={`/dashboard/players/${player.id}`} key={player.id}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <img 
                  src={player.image} 
                  alt={player.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg">{player.name}</h3>
                <p className="text-gray-600 text-sm">{player.university}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {player.role}
                  </span>
                  <span className="text-gray-500 text-sm">{player.matches} matches</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {filteredPlayers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No players found matching your search.</p>
        </div>
      )}
    </div>
  );
}
