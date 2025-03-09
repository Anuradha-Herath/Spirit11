"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

// Mock player detailed data
const MOCK_PLAYERS_DETAILS = {
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

export default function PlayerStatsPage() {
  const params = useParams();
  const router = useRouter();
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("stats");

  useEffect(() => {
    // Get player ID from URL params
    const playerId = params.id as string;

    // Simulating API call with mock data
    setTimeout(() => {
      if (MOCK_PLAYERS_DETAILS[playerId as keyof typeof MOCK_PLAYERS_DETAILS]) {
        setPlayer(MOCK_PLAYERS_DETAILS[playerId as keyof typeof MOCK_PLAYERS_DETAILS]);
        setLoading(false);
      } else {
        setError("Player not found");
        setLoading(false);
      }
    }, 500);
  }, [params.id]);

  const handleBackClick = () => {
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
          onClick={handleBackClick}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Back to Players
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white p-4">
        <div className="flex justify-between items-center">
          <button 
            onClick={handleBackClick}
            className="text-white hover:text-yellow-400 flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Players
          </button>
          <h1 className="text-xl font-bold">{player.name}</h1>
          <button 
            className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
          >
            Edit Player
          </button>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'stats' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('stats')}
          >
            Statistics
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'performance' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('performance')}
          >
            Performance Analysis
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'history' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('history')}
          >
            Match History
          </button>
        </nav>
      </div>

      <div className="p-6">
        {/* Player Basic Info */}
        <div className="md:flex mb-6">
          <div className="md:w-1/3 mb-4 md:mb-0">
            <div className="rounded-lg overflow-hidden bg-gray-100 shadow">
              <img 
                src={player.image} 
                alt={player.name} 
                className="w-full h-auto"
              />
            </div>
          </div>
          <div className="md:w-2/3 md:pl-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{player.name}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                player.role === 'Batsman' ? 'bg-green-100 text-green-800' :
                player.role === 'Bowler' ? 'bg-red-100 text-red-800' :
                player.role === 'All-rounder' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {player.role}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">University</p>
                <p className="font-medium">{player.university}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Age</p>
                <p className="font-medium">{player.age}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Matches</p>
                <p className="font-medium">{player.matches}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Value</p>
                <p className="font-medium text-green-600">Rs. {player.budget * 100000000}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500">Bio</p>
              <p className="text-gray-700">{player.bio}</p>
            </div>
          </div>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'stats' && (
          <div>
            <h3 className="text-lg font-bold mb-4">Batting Statistics</h3>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-gray-500">Total Runs</div>
                  <div className="text-xl font-bold">{player.runs}</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-gray-500">Average</div>
                  <div className="text-xl font-bold">{player.batting_average || '-'}</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-gray-500">Strike Rate</div>
                  <div className="text-xl font-bold">{player.batting_strike_rate || '-'}</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-gray-500">High Score</div>
                  <div className="text-xl font-bold">{player.high_score || '-'}</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-gray-500">100s</div>
                  <div className="text-xl font-bold">{player.centuries || 0}</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-gray-500">50s</div>
                  <div className="text-xl font-bold">{player.fifties || 0}</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-gray-500">Innings</div>
                  <div className="text-xl font-bold">{player.matches}</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-gray-500">Runs/Match</div>
                  <div className="text-xl font-bold">{(player.runs / player.matches).toFixed(1)}</div>
                </div>
              </div>
            </div>
            
            {(player.role === 'Bowler' || player.role === 'All-rounder') && (
              <>
                <h3 className="text-lg font-bold mb-4">Bowling Statistics</h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white p-3 rounded shadow-sm">
                      <div className="text-sm text-gray-500">Wickets</div>
                      <div className="text-xl font-bold">{player.wickets}</div>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                      <div className="text-sm text-gray-500">Average</div>
                      <div className="text-xl font-bold">{player.bowling_average || '-'}</div>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                      <div className="text-sm text-gray-500">Economy</div>
                      <div className="text-xl font-bold">{player.economy || '-'}</div>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                      <div className="text-sm text-gray-500">Wickets/Match</div>
                      <div className="text-xl font-bold">{(player.wickets / player.matches).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {player.role === 'Wicket Keeper' && (
              <>
                <h3 className="text-lg font-bold mb-4">Wicket-Keeping Statistics</h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white p-3 rounded shadow-sm">
                      <div className="text-sm text-gray-500">Catches</div>
                      <div className="text-xl font-bold">{player.catches || 0}</div>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                      <div className="text-sm text-gray-500">Stumpings</div>
                      <div className="text-xl font-bold">{player.stumping || 0}</div>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                      <div className="text-sm text-gray-500">Total Dismissals</div>
                      <div className="text-xl font-bold">{(player.catches || 0) + (player.stumping || 0)}</div>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                      <div className="text-sm text-gray-500">Dismissals/Match</div>
                      <div className="text-xl font-bold">
                        {(((player.catches || 0) + (player.stumping || 0)) / player.matches).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        
        {activeTab === 'performance' && (
          <div>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-yellow-700">
                Performance analysis charts will be displayed here. This feature is under development.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4 h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="mb-2">Batting Performance Chart</div>
                  <div className="text-sm">(Coming Soon)</div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="mb-2">Match-by-Match Performance</div>
                  <div className="text-sm">(Coming Soon)</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'history' && (
          <div>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-yellow-700">
                Match history will be displayed here. This feature is under development.
              </p>
            </div>
            
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opponent</th>
                  <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Runs</th>
                  <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wickets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="text-center">
                  <td className="py-4 px-4" colSpan={4}>No match history available yet</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
