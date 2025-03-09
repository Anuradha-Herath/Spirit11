"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Player } from "@/types/player";

// Keep mock data as fallback only
const MOCK_PLAYER_DETAILS = {
  "1": {
    id: "1",
    name: "Kasun Perera",
    university: "University of Moratuwa",
    role: "Batsman",
    budget: 10.5, // in millions
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
    bio: "Kasun is a talented top-order batsman known for his elegant stroke play and ability to play long innings. He's been consistently performing for University of Moratuwa for three seasons."
  },
  "2": {
    id: "2",
    name: "Amal Silva",
    university: "University of Colombo",
    role: "Bowler",
    budget: 9.2, // in millions
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
    bio: "Amal is a right-arm fast bowler known for his ability to swing the ball both ways. He's particularly effective in the early overs and a vital part of University of Colombo's bowling attack."
  },
  "3": {
    id: "3",
    name: "Nuwan Pradeep",
    university: "University of Peradeniya",
    role: "All-rounder",
    budget: 11.0, // in millions
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
    bio: "Nuwan is a versatile all-rounder who can contribute in all departments of the game. He's known for his aggressive batting in the middle order and his medium-pace bowling that often breaks partnerships."
  },
  "4": {
    id: "4",
    name: "Dinesh Chandimal",
    university: "University of Moratuwa",
    role: "Wicket Keeper",
    budget: 9.8, // in millions
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
    bio: "Dinesh is an agile wicket-keeper with quick reflexes and good game awareness. He's also a reliable middle-order batsman who can accelerate when needed and has a knack for finishing games."
  },
  "5": {
    id: "5",
    name: "Lahiru Kumara",
    university: "University of Colombo",
    role: "Bowler",
    budget: 8.5, // in millions
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
    bio: "Lahiru is a skilled spinner who can turn the ball sharply. He's particularly effective on dry pitches and has developed excellent control over his variations, making him a threat in all phases of the game."
  },
  "6": {
    id: "6",
    name: "Kusal Mendis",
    university: "University of Kelaniya",
    role: "Batsman",
    budget: 10.2, // in millions
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
    bio: "Kusal is an explosive opening batsman who can set the tone for the innings. He's particularly strong against pace bowling and has the ability to clear the boundary with ease. His century against University of Colombo last season is still remembered as one of the finest innings in university cricket."
  }
};

export default function PlayerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const playerId = params.id as string;
    
    const fetchPlayerDetails = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(`/api/players/${playerId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch player details: ${response.status}`);
        }
        
        const data = await response.json();
        setPlayer(data);
      } catch (err) {
        console.error("Error fetching player details:", err);
        setError("Failed to load player details. Using demo data instead.");
        
        // Fallback to mock data if available for this ID
        if (MOCK_PLAYER_DETAILS[playerId as keyof typeof MOCK_PLAYER_DETAILS]) {
          setPlayer(MOCK_PLAYER_DETAILS[playerId as keyof typeof MOCK_PLAYER_DETAILS]);
        } else {
          setError("Player not found");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayerDetails();
  }, [params.id]);

  const handleBackClick = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600">{error || "Error loading player"}</h2>
        <button 
          onClick={handleBackClick}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-blue-600 text-white flex items-center justify-between">
        <button 
          onClick={handleBackClick}
          className="text-white hover:text-blue-200 flex items-center"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold">{player.name}</h1>
        <div className="w-8"></div> {/* Empty space to balance the header */}
      </div>

      <div className="md:flex">
        {/* Player image and basic info */}
        <div className="md:w-1/3 p-6">
          <div className="rounded-lg overflow-hidden bg-gray-100 mb-4">
            <img 
              src={player.image} 
              alt={player.name} 
              className="w-full object-cover"
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="font-bold text-lg border-b pb-2 mb-2">Basic Info</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Role:</span>
                <span className="font-medium">{player.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">University:</span>
                <span className="font-medium">{player.university}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Age:</span>
                <span className="font-medium">{player.age}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Budget:</span>
                <span className="font-medium">${player.budget}M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Matches:</span>
                <span className="font-medium">{player.matches}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Player stats and bio */}
        <div className="md:w-2/3 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Player Bio</h2>
            <p className="text-gray-700">{player.bio}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="font-bold text-lg mb-4">Batting Stats</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-sm text-gray-500">Runs</div>
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
                <div className="text-sm text-gray-500">50s</div>
                <div className="text-xl font-bold">{player.fifties || 0}</div>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-sm text-gray-500">100s</div>
                <div className="text-xl font-bold">{player.centuries || 0}</div>
              </div>
            </div>
          </div>

          {player.role === 'Bowler' || player.role === 'All-rounder' ? (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h2 className="font-bold text-lg mb-4">Bowling Stats</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
              </div>
            </div>
          ) : null}

          {player.role === 'Wicket Keeper' ? (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h2 className="font-bold text-lg mb-4">Keeping Stats</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-gray-500">Catches</div>
                  <div className="text-xl font-bold">{player.catches || 0}</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-gray-500">Stumpings</div>
                  <div className="text-xl font-bold">{player.stumping || 0}</div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
