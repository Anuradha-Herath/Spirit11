/**
 * Calculate player value in LKR based on stats
 * The formula takes into account multiple factors relevant to the player's role
 */
export function calculatePlayerValue(player: any): number {
  // Base value that all players start with
  let baseValue = 5000000; // 5 million LKR

  // Role-specific multipliers
  const roleMultipliers: Record<string, number> = {
    'Batsman': 1.0,
    'Bowler': 1.0,
    'All-rounder': 1.2, // All-rounders are more valuable
    'Wicket Keeper': 1.1 // Wicket keepers have a premium
  };
  
  // Add value based on matches played (experience)
  const matchesValue = player.matches * 50000; // 50K per match
  
  // Calculate batting value
  let battingValue = 0;
  if (player.runs) {
    battingValue += player.runs * 1000; // 1K per run
    
    // Batting average bonus
    if (player.batting_average) {
      battingValue += (player.batting_average > 30) ? 
        (player.batting_average - 30) * 100000 : 0;
    }
    
    // Strike rate bonus
    if (player.batting_strike_rate) {
      battingValue += (player.batting_strike_rate > 120) ? 
        (player.batting_strike_rate - 120) * 20000 : 0;
    }
    
    // Bonuses for centuries and fifties
    battingValue += (player.centuries || 0) * 2000000; // 2M per century
    battingValue += (player.fifties || 0) * 500000; // 500K per fifty
  }
  
  // Calculate bowling value
  let bowlingValue = 0;
  if (player.wickets) {
    bowlingValue += player.wickets * 200000; // 200K per wicket
    
    // Bowling average bonus (lower is better)
    if (player.bowling_average) {
      bowlingValue += (player.bowling_average < 25) ? 
        (25 - player.bowling_average) * 100000 : 0;
    }
    
    // Economy bonus (lower is better)
    if (player.economy) {
      bowlingValue += (player.economy < 7) ? 
        (7 - player.economy) * 200000 : 0;
    }
  }
  
  // Calculate wicket-keeping value
  let keepingValue = 0;
  if (player.role === 'Wicket Keeper') {
    keepingValue += (player.catches || 0) * 100000; // 100K per catch
    keepingValue += (player.stumping || 0) * 150000; // 150K per stumping
  }
  
  // Calculate total value with role multiplier
  const roleMultiplier = roleMultipliers[player.role] || 1.0;
  const totalValue = (baseValue + matchesValue + battingValue + bowlingValue + keepingValue) * roleMultiplier;
  
  // Return the calculated value, ensure it's at least 1 million
  return Math.max(totalValue, 1000000);
}

/**
 * Calculate player points based on stats and role
 */
export function calculatePlayerPoints(player: any): number {
  let points = 0;
  
  // Base points for each player
  points += 10;
  
  // Points for batting performance
  if (player.runs) {
    points += player.runs * 0.5; // 0.5 point per run
    points += (player.centuries || 0) * 50; // 50 points per century
    points += (player.fifties || 0) * 20; // 20 points per fifty
    
    // Strike rate bonus
    if (player.batting_strike_rate && player.batting_strike_rate > 130) {
      points += 10;
    }
  }
  
  // Points for bowling performance
  if (player.wickets) {
    points += player.wickets * 20; // 20 points per wicket
    
    // Economy bonus
    if (player.economy && player.economy < 5) {
      points += 15;
    }
  }
  
  // Points for wicket-keeping performance
  if (player.role === 'Wicket Keeper') {
    points += (player.catches || 0) * 10; // 10 points per catch
    points += (player.stumping || 0) * 15; // 15 points per stumping
  }
  
  // Role-specific bonuses
  if (player.role === 'All-rounder' && player.runs > 200 && player.wickets > 10) {
    points += 30; // Bonus for well-performing all-rounders
  }
  
  // Bonus for experienced players
  points += Math.min(player.matches, 30); // Max 30 points for experience

  return Math.round(points);
}
