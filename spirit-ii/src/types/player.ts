interface Player {
  name: string;
  university: string;
  category: "Batsman" | "Bowler" | "All-Rounder";
  totalRuns: number;
  ballsFaced: number;
  wickets: number;
  oversBowled: number;
  runsConceded: number;
  points: number;
  value: number;
  readOnly: boolean; // For dataset players
}

export default Player;