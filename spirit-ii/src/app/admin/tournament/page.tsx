"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { adminSocket, ADMIN_EVENTS } from "@/lib/admin-socket";
import { UpdateTracker } from "@/utils/UpdateTracker";
import UpdatedField from "@/components/admin/UpdatedField";

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
  const [tournamentStats, setTournamentStats] = useState(TOURNAMENT_STATS);
  const [playerStats, setPlayerStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedStatsFields, setUpdatedStatsFields] = useState(new Set());
  const statsRef = useRef(tournamentStats);
  const updateTracker = useRef(new UpdateTracker());
  
  // Top performers data
  const [topRunScorer, setTopRunScorer] = useState(null);
  const [topWicketTaker, setTopWicketTaker] = useState(null);
  
  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        setIsLoading(true);
        
        // Get auth token
        const userData = localStorage.getItem("user");
        let authHeader = '';
        if (userData) {
          const user = JSON.parse(userData);
          authHeader = `Bearer ${user.username}`;
        }
        
        // Fetch tournament stats
        const statsResponse = await fetch('/api/admin/tournament', {
          headers: { 'Authorization': authHeader }
        });
        
        if (!statsResponse.ok) {
          throw new Error(`Failed to fetch tournament stats: ${statsResponse.status}`);
        }
        
        const statsData = await statsResponse.json();
        setTournamentStats(statsData);
        statsRef.current = statsData;
        
        // Fetch all players for top performers
        const playersResponse = await fetch('/api/admin/players', {
          headers: { 'Authorization': authHeader }
        });
        
        if (!playersResponse.ok) {
          throw new Error(`Failed to fetch players: ${playersResponse.status}`);
        }
        
        const playersData = await playersResponse.json();
        setPlayerStats(playersData);
        
        // Calculate top performers
        findTopPerformers(playersData);
        
      } catch (error) {
        console.error("Error fetching tournament data:", error);
        setError("Failed to load tournament data");
        
        // Use mock data as fallback
        findTopPerformers(PLAYER_STATS);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Function to find top performers
    const findTopPerformers = (players) => {
      if (!players || players.length === 0) return;
      
      // Find top run scorer
      const topRuns = [...players].sort((a, b) => 
        (b.total_runs || b.runs || 0) - (a.total_runs || a.runs || 0)
      )[0];
      
      // Find top wicket taker
      const topWickets = [...players].sort((a, b) => 
        (b.wickets || 0) - (a.wickets || 0)
      )[0];
      
      setTopRunScorer(topRuns);
      setTopWicketTaker(topWickets);
    };
    
    fetchTournamentData();
    
    // Connect to admin socket for real-time updates
    adminSocket.connect();
    
    // Subscribe to stats updates
    const statsUnsubscribe = adminSocket.subscribe(
      ADMIN_EVENTS.STATS_UPDATED,
      async (data) => {
        console.log("Received stats update:", data);
        setIsUpdating(true);
        
        // Update player stats which may affect top performers
        try {
          const userData = localStorage.getItem("user");
          let authHeader = '';
          if (userData) {
            const user = JSON.parse(userData);
            authHeader = `Bearer ${user.username}`;
          }
          
          const playersResponse = await fetch('/api/admin/players', {
            headers: { 'Authorization': authHeader }
          });
          
          if (playersResponse.ok) {
            const updatedPlayers = await playersResponse.json();
            setPlayerStats(updatedPlayers);
            findTopPerformers(updatedPlayers);
          }
        } catch (playerError) {
          console.error("Error updating players:", playerError);
        }
        
        setTimeout(() => {
          setIsUpdating(false);
        }, 1000);
      }
    );
    
    // Subscribe to tournament updates
    const tournamentUnsubscribe = adminSocket.subscribe(
      ADMIN_EVENTS.TOURNAMENT_UPDATED,
      (data) => {
        console.log("Received tournament update:", data);
        setIsUpdating(true);
        
        const updatedStats = {
          ...statsRef.current,
          ...data
        };
        
        // Track which fields were updated
        const changedFields = updateTracker.current.trackChanges(updatedStats);
        setUpdatedStatsFields(changedFields);
        
        setTournamentStats(updatedStats);
        statsRef.current = updatedStats;
        
        setTimeout(() => {
          setIsUpdating(false);
          setUpdatedStatsFields(new Set());
        }, 1500);
      }
    );
    
    // Clean up on unmount
    return () => {
      statsUnsubscribe();
      tournamentUnsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tournament Summary</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Runs */}
        <div className={`bg-white p-6 rounded-lg shadow ${updatedStatsFields.has('total_runs') ? 'animate-highlight' : ''}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Runs</p>
              <p className="text-3xl font-bold text-blue-600">{tournamentStats.total_runs || 0}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">Across all matches</p>
        </div>
        
        {/* Total Wickets */}
        <div className={`bg-white p-6 rounded-lg shadow ${updatedStatsFields.has('total_wickets') ? 'animate-highlight' : ''}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Wickets</p>
              <p className="text-3xl font-bold text-red-600">{tournamentStats.total_wickets || 0}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">Total fall of wickets</p>
        </div>
        
        {/* Matches */}
        <div className={`bg-white p-6 rounded-lg shadow ${updatedStatsFields.has('total_matches') ? 'animate-highlight' : ''}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Matches Played</p>
              <p className="text-3xl font-bold text-green-600">{tournamentStats.total_matches || 0}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">Out of {tournamentStats.total_matches + tournamentStats.upcoming_matches}</p>
        </div>
        
        {/* Tournament Progress */}
        <div className={`bg-white p-6 rounded-lg shadow ${updatedStatsFields.has('completed_percentage') ? 'animate-highlight' : ''}`}>
          <p className="text-sm font-medium text-gray-500">Tournament Progress</p>
          <div className="mt-2 relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200">
                  {tournamentStats.completed_percentage || 0}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded bg-purple-200">
              <div style={{ width: `${tournamentStats.completed_percentage || 0}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"></div>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">Overall tournament completion</p>
        </div>
      </div>
      
      {/* Top Performers Section */}
      <h2 className="text-xl font-bold mt-8 mb-4">Top Performers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Run Scorer */}
        {topRunScorer && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-medium text-lg mb-4">Highest Run Scorer</h3>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img 
                  src={topRunScorer.image || "https://via.placeholder.com/80"} 
                  alt={topRunScorer.name}
                  className="h-20 w-20 rounded-full object-cover border-2 border-blue-500"
                />
              </div>
              <div>
                <Link href={`/admin/players/${topRunScorer.id}`} className="font-bold text-lg text-blue-600 hover:underline">
                  {topRunScorer.name}
                </Link>
                <p className="text-gray-500">{topRunScorer.university}</p>
                <div className="mt-2">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                    {topRunScorer.total_runs || topRunScorer.runs || 0} runs
                  </span>
                  <span className="bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    SR: {topRunScorer.batting_strike_rate || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Top Wicket Taker */}
        {topWicketTaker && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-medium text-lg mb-4">Highest Wicket Taker</h3>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img 
                  src={topWicketTaker.image || "https://via.placeholder.com/80"} 
                  alt={topWicketTaker.name}
                  className="h-20 w-20 rounded-full object-cover border-2 border-red-500"
                />
              </div>
              <div>
                <Link href={`/admin/players/${topWicketTaker.id}`} className="font-bold text-lg text-red-600 hover:underline">
                  {topWicketTaker.name}
                </Link>
                <p className="text-gray-500">{topWicketTaker.university}</p>
                <div className="mt-2">
                  <span className="bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                    {topWicketTaker.wickets} wickets
                  </span>
                  <span className="bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    Econ: {topWicketTaker.economy || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Performance Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow mt-6">
        <h3 className="font-medium text-lg mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-500">Avg. Runs Per Match</p>
            <p className="text-xl font-bold">{tournamentStats.average_runs_per_match || 0}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-500">Avg. Wickets Per Match</p>
            <p className="text-xl font-bold">{tournamentStats.average_wickets_per_match || 0}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-500">Highest Individual Score</p>
            <p className="text-xl font-bold">{tournamentStats.highest_score || 0}</p>
          </div>
        </div>
      </div>
      
      {/* Participating Universities */}
      <div className="bg-white p-6 rounded-lg shadow mt-6">
        <h3 className="font-medium text-lg mb-4">Participating Universities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {UNIVERSITIES.map((university) => (
            <div key={university.name} className="bg-gray-50 p-3 rounded text-center">
              <p className="font-medium">{university.name}</p>
              <div className="text-xs text-gray-500 mt-1">
                <span className="text-green-600">{university.wins}W</span> - <span className="text-red-600">{university.losses}L</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {isUpdating && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg shadow-lg animate-fade-in-out">
          Updating tournament statistics...
        </div>
      )}
    </div>
  );
}

// Mock player data for initial rendering
const PLAYER_STATS = [
  {
    id: "1",
    name: "Kasun Perera",
    university: "University of Moratuwa",
    category: "Batsman",
    image: "https://via.placeholder.com/80",
    total_runs: 1200,
    batting_strike_rate: 135.8,
    runs: 1200,
    wickets: 0,
  },
  {
    id: "2",
    name: "Amal Silva",
    university: "University of Colombo",
    category: "Bowler",
    image: "https://via.placeholder.com/80",
    total_runs: 120,
    batting_strike_rate: 85.6,
    runs: 120,
    wickets: 45,
    economy: 4.2,
  },
  {
    id: "3",
    name: "Nuwan Pradeep",
    university: "University of Peradeniya",
    category: "All-rounder",
    image: "https://via.placeholder.com/80",
    total_runs: 450,
    batting_strike_rate: 110.3,
    runs: 450,
    wickets: 30,
    economy: 5.1,
  }
];

// Universities data for display
const UNIVERSITIES = [
  { name: "University of Moratuwa", wins: 10, losses: 5 },
  { name: "University of Colombo", wins: 8, losses: 7 },
  { name: "University of Peradeniya", wins: 7, losses: 8 },
  { name: "University of Kelaniya", wins: 9, losses: 6 },
  { name: "University of Jaffna", wins: 6, losses: 9 },
  { name: "University of Ruhuna", wins: 5, losses: 10 },
];