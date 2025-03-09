/**
 * Calculate player value in LKR based on simplified stats
 */
export function calculatePlayerValue(player: any): number {
  try {
    const player_points = calculatePlayerPoints(player);
    // Apply the formula (9 * points + 100) * 1000
    let value = (9 * player_points + 100) * 1000;
    // Round to nearest 50,000
    value = Math.round(value / 50000) * 50000;
    return value;
  } catch (error) {
    console.error("Error calculating player value:", error);
    return 1000000; // Default value of 1M LKR
  }
}

/**
 * Calculate player points based on simplified stats and category
 */
export function calculatePlayerPoints(player: any): number {
  // Default values to prevent NaN or infinity results
  let points = 0;
  
  try {
    // Batting points calculation with new field names
    const inningsPlayed = player.innings_played || 1;
    const ballsFaced = player.balls_faced || 1;
    
    // Basic batting points based on strike rate (runs / balls * 100)
    const battingPoints = (player.total_runs || 0) / inningsPlayed * 2;
    
    // Bowling points calculation
    const oversBowled = player.overs_bowled || 0;
    const runsConceded = player.runs_conceded || 0;
    const wickets = player.wickets || 0;
    
    // Basic bowling points
    const bowlingPoints = wickets * 10;
    
    // Economy based points (if applicable)
    let economyPoints = 0;
    if (oversBowled > 0) {
      const economy = runsConceded / oversBowled;
      economyPoints = Math.max(0, 10 - economy) * 2;
    }
    
    // Calculate final points based on player category
    switch (player.category || player.role) {
      case "Batsman":
        points = battingPoints * 1.2 + bowlingPoints * 0.3;
        break;
      case "Bowler":
        points = battingPoints * 0.3 + bowlingPoints * 1.5 + economyPoints;
        break;
      case "All-rounder":
        points = battingPoints * 0.8 + bowlingPoints * 0.8 + economyPoints * 0.8;
        break;
      case "Wicket Keeper":
        points = battingPoints * 1.1 + bowlingPoints * 0.2;
        break;
      default:
        points = battingPoints + bowlingPoints;
    }
    
    return Math.round(points);
  } catch (error) {
    console.error("Error calculating player points:", error);
    return 10; // Default points
  }
}
