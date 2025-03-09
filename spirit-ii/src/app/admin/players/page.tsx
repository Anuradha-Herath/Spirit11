"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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

  return (
    <div>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Players Management</h1>
          <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            Add Player
          </button>
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
                <th className="py-3 px-4 border-b border-gray-200 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAndSortedPlayers.map((player) => (
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
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    <Link 
                      href={`/admin/players/${player.id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      View
                    </Link>
                    <button className="text-purple-600 hover:text-purple-900 mr-4">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredAndSortedPlayers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-4 px-4 text-center text-gray-500">
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