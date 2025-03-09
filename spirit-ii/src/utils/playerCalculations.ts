/**
 * Calculate player value in LKR based on stats
 * The formula takes into account multiple factors relevant to the player's role
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
 * Calculate player points based on stats and role
 * Using the formula:
 * Points = ((Batting_Strike_Rate / 5) + ((Batting_Average * 0.8) / 5)) + ((500 / Bowling_Strike_Rate) + (140 / Economy_Rate))
 */
export function calculatePlayerPoints(player: any): number {
  // Default values to prevent NaN or infinity results
  let points = 0;
  
  try {
    // Calculate batting metrics
    // Note: Using innings_played if available, fallback to matches
    const inningsPlayed = player.innings_played || player.matches || 1;
    const ballsFaced = player.balls_faced || (player.runs * 0.7) || 1; // Estimate balls if not available
    
    const batting_strike_rate = (player.runs / ballsFaced) * 100;
    const batting_average = player.runs / inningsPlayed;
    
    // Calculate bowling metrics
    const wickets = player.wickets || 0.1; // Avoid division by zero
    const balls_bowled = player.balls_bowled || (player.wickets * 24) || 1; // Estimate balls if not available
    const runs_conceded = player.runs_conceded || (player.wickets * 20) || 1; // Estimate runs if not available
    
    const bowling_strike_rate = balls_bowled / wickets;
    const economy_rate = (runs_conceded / balls_bowled) * 6;
    
    // Calculate total points using the formula
    const battingPoints = (batting_strike_rate / 5) + ((batting_average * 0.8) / 5);
    const bowlingPoints = (500 / bowling_strike_rate) + (140 / economy_rate);
    
    points = battingPoints + bowlingPoints;
    
    // Apply role-specific adjustments
    if (player.role === 'Batsman') {
      points = points * 1.2; // 20% bonus for specialist batsmen
    } else if (player.role === 'Bowler') {
      points = points * 1.2; // 20% bonus for specialist bowlers
    } else if (player.role === 'Wicket Keeper') {
      // Add points for keeping stats if available
      const keepingPoints = ((player.stumping || 0) * 2) + ((player.catches || 0) * 1);
      points += keepingPoints;
    }
    
    // Make sure points are non-negative
    return Math.max(0, points);
  } catch (error) {
    console.error("Error calculating player points:", error);
    return 0;
  }
}
