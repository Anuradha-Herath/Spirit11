"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Mock tournament data for demonstration
const TOURNAMENT_STATS = {
  total_matches: 15,
  total_runs: 5430,
  total_wickets: 162,
  highest_score: 105,
  average_runs_per_match: 362,
  average_wickets_per_match: 10.8,
  completed_percentage: 60, // Tournament progress, percentage complete
  upcoming_matches: 10,
  participating_universities: 8,
};

// Mock player data
const PLAYER_STATS = [
  {
    id: "6", // Kusal Mendis
    name: "Kusal Mendis",
    university: "University of Kelaniya",
    role: "Batsman",
    image: "https://via.placeholder.com/150",
    runs: 1150,
    average: 42.8,
    strike_rate: 140.2,
  },
  {
    id: "1", // Kasun Perera
    name: "Kasun Perera",
    university: "University of Moratuwa",
    role: "Batsman",
    image: "https://via.placeholder.com/150",
    runs: 1200,
    average: 45.5,
    strike_rate: 135.8,
  },
  {
    id: "2", // Amal Silva
    name: "Amal Silva",
    university: "University of Colombo",
    role: "Bowler",
    image: "https://via.placeholder.com/150",
    wickets: 45,
    economy: 4.2,
    avg: 21.5,
  },
  {
    id: "5", // Lahiru Kumara
    name: "Lahiru Kumara",
    university: "University of Colombo",
    role: "Bowler",
    image: "https://via.placeholder.com/150",
    wickets: 38,
    economy: 3.8,
    avg: 19.3,
  },
];

// Universities participation
const UNIVERSITIES = [
  { name: "University of Moratuwa", matches: 15, wins: 10, losses: 5 },
  { name: "University of Colombo", matches: 15, wins: 8, losses: 7 },
  { name: "University of Peradeniya", matches: 15, wins: 7, losses: 8 },
  { name: "University of Kelaniya", matches: 15, wins: 9, losses: 6 },
  { name: "University of Jaffna", matches: 15, wins: 6, losses: 9 },
  { name: "University of Ruhuna", matches: 15, wins: 5, losses: 10 },
];

export default function TournamentSummaryPage() {
  // Find top players
  const highestRunScorer = [...PLAYER_STATS].sort((a, b) => (b.runs || 0) - (a.runs || 0))[0];
  const highestWicketTaker = [...PLAYER_STATS].sort((a, b) => (b.wickets || 0) - (a.wickets || 0))[0];

  return (
    <div>
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Tournament Summary</h1>
        
        {/* Tournament Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Tournament Progress</h2>
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {TOURNAMENT_STATS.completed_percentage}% Complete
            </span>
          </div>
          <div className="bg-gray-200 rounded-full h-4">
            <div 
              className="bg-blue-600 h-4 rounded-full" 
              style={{ width: `${TOURNAMENT_STATS.completed_percentage}%` }}
            ></div>
          </div>
          <div className="mt-2 flex justify-between text-sm text-gray-500">
            <span>Matches Played: {TOURNAMENT_STATS.total_matches}</span>
            <span>Upcoming Matches: {TOURNAMENT_STATS.upcoming_matches}</span>
          </div>
        </div>
        
        {/* Overall Statistics - Required by specification */}
        <div className="bg-indigo-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-indigo-800 mb-4">Overall Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm text-center">
              <div className="text-4xl font-bold text-indigo-600">{TOURNAMENT_STATS.total_runs}</div>
              <div className="text-sm mt-1 text-gray-600">Total Runs</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm text-center">
              <div className="text-4xl font-bold text-indigo-600">{TOURNAMENT_STATS.total_wickets}</div>
              <div className="text-sm mt-1 text-gray-600">Total Wickets</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm text-center">
              <div className="text-4xl font-bold text-indigo-600">{TOURNAMENT_STATS.average_runs_per_match}</div>
              <div className="text-sm mt-1 text-gray-600">Avg Runs/Match</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm text-center">
              <div className="text-4xl font-bold text-indigo-600">{TOURNAMENT_STATS.highest_score}</div>
              <div className="text-sm mt-1 text-gray-600">Highest Score</div>
            </div>
          </div>
        </div>
        
        {/* Top Performers - Highest run scorer and highest wicket taker, required by specification */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Top Performers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Highest Run Scorer */}
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
              <div className="flex items-center">
                <img 
                  src={highestRunScorer.image} 
                  alt={highestRunScorer.name} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-yellow-400"
                />
                <div className="ml-4">
                  <h3 className="font-medium">Highest Run Scorer</h3>
                  <Link href={`/admin/players/${highestRunScorer.id}`} className="text-lg font-bold text-yellow-800 hover:underline">
                    {highestRunScorer.name}
                  </Link>
                  <p className="text-sm text-gray-600">{highestRunScorer.university}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-xl font-bold text-yellow-700">{highestRunScorer.runs}</div>
                  <div className="text-xs text-gray-500">Runs</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-yellow-700">{highestRunScorer.average}</div>
                  <div className="text-xs text-gray-500">Average</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-yellow-700">{highestRunScorer.strike_rate}</div>
                  <div className="text-xs text-gray-500">Strike Rate</div>
                </div>
              </div>
            </div>
            
            {/* Highest Wicket Taker */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <div className="flex items-center">
                <img 
                  src={highestWicketTaker.image} 
                  alt={highestWicketTaker.name} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-green-400"
                />
                <div className="ml-4">
                  <h3 className="font-medium">Highest Wicket Taker</h3>
                  <Link href={`/admin/players/${highestWicketTaker.id}`} className="text-lg font-bold text-green-800 hover:underline">
                    {highestWicketTaker.name}
                  </Link>
                  <p className="text-sm text-gray-600">{highestWicketTaker.university}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-xl font-bold text-green-700">{highestWicketTaker.wickets}</div>
                  <div className="text-xs text-gray-500">Wickets</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-700">{highestWicketTaker.economy}</div>
                  <div className="text-xs text-gray-500">Economy</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-700">{highestWicketTaker.avg}</div>
                  <div className="text-xs text-gray-500">Average</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* University Stats */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">University Performance</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    University
                  </th>
                  <th className="py-3 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Matches
                  </th>
                  <th className="py-3 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wins
                  </th>
                  <th className="py-3 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Losses
                  </th>
                  <th className="py-3 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Win %
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {UNIVERSITIES.sort((a, b) => b.wins - a.wins).map((uni) => (
                  <tr key={uni.name} className="hover:bg-gray-50">
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{uni.name}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                      {uni.matches}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      {uni.wins}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-red-600 font-medium">
                      {uni.losses}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                      {((uni.wins / uni.matches) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Recent Matches */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Matches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500">21 May 2023</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Completed</span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">University of Moratuwa</div>
                  <div className="text-sm text-gray-500">185/6</div>
                </div>
                <div className="text-xs font-medium px-2 py-1 bg-gray-200 rounded">vs</div>
                <div className="text-right">
                  <div className="font-medium">University of Colombo</div>
                  <div className="text-sm text-gray-500">172/8</div>
                </div>
              </div>
              <div className="text-right mt-2">
                <span className="text-xs text-green-600 font-medium">University of Moratuwa won by 13 runs</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500">20 May 2023</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Completed</span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">University of Kelaniya</div>
                  <div className="text-sm text-gray-500">165/9</div>
                </div>
                <div className="text-xs font-medium px-2 py-1 bg-gray-200 rounded">vs</div>
                <div className="text-right">
                  <div className="font-medium">University of Peradeniya</div>
                  <div className="text-sm text-gray-500">140/10</div>
                </div>
              </div>
              <div className="text-right mt-2">
                <span className="text-xs text-green-600 font-medium">University of Kelaniya won by 25 runs</span>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              View All Matches →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}