"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { eventService, EVENTS } from '@/lib/event-service';

// Initial budget in LKR (9 million * 100)
export const INITIAL_BUDGET_LKR = 900000000;

interface TeamContextType {
  team: any[];
  setTeam: React.Dispatch<React.SetStateAction<any[]>>;
  remainingBudget: number;
  spentBudget: number;
  addPlayer: (player: any) => boolean;
  removePlayer: (playerId: string) => void;
  calculatePoints: () => number | null;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [team, setTeam] = useState<any[]>([]);
  const [remainingBudget, setRemainingBudget] = useState(INITIAL_BUDGET_LKR);
  const [spentBudget, setSpentBudget] = useState(0);

  // Load team from localStorage on initial mount
  useEffect(() => {
    const savedTeam = localStorage.getItem("myTeam");
    if (savedTeam) {
      try {
        const parsedTeam = JSON.parse(savedTeam);
        setTeam(parsedTeam);
        
        // Calculate budget stats
        const spent = parsedTeam.reduce((total: number, player: any) => {
          // Convert the budget to LKR if it's still in millions
          const playerBudgetLkr = player.budgetLkr || player.budget * 100000000;
          return total + playerBudgetLkr;
        }, 0);
        
        setSpentBudget(spent);
        setRemainingBudget(INITIAL_BUDGET_LKR - spent);
      } catch (e) {
        console.error("Error loading saved team", e);
      }
    }
  }, []);

  // Save team to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("myTeam", JSON.stringify(team));
    
    // Publish event for real-time updates
    eventService.publish(EVENTS.TEAM_UPDATED, {
      team,
      remainingBudget,
      spentBudget
    });
  }, [team, remainingBudget, spentBudget]);

  // Mock point calculation function
  const calculatePlayerPoints = (player: any) => {
    return Math.floor(Math.random() * 80) + 20; // Random points between 20-100
  };

  const calculatePoints = () => {
    if (team.length === 11) {
      // Calculate points for each player and sum them
      const points = team.reduce((total, player) => {
        return total + calculatePlayerPoints(player);
      }, 0);
      
      // Update points in localStorage for leaderboard
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          user.points = points;
          localStorage.setItem("user", JSON.stringify(user));
          
          // Publish points update event
          eventService.publish(EVENTS.POINTS_UPDATED, { points });
        } catch (e) {
          console.error("Error updating user points", e);
        }
      }
      
      return points;
    }
    return null;
  };

  const addPlayer = (player: any) => {
    // Check if player is already in the team
    if (team.some(p => p.id === player.id)) {
      return false;
    }
    
    // Check if team size limit reached (11 players)
    if (team.length >= 11) {
      return false;
    }
    
    // Convert budget to LKR if not already
    const playerBudgetLkr = player.budgetLkr || player.budget * 100000000;
    
    // Check if adding the player exceeds the budget
    if (playerBudgetLkr > remainingBudget) {
      return false;
    }
    
    // Add budget in LKR to the player object
    const playerWithLkr = {
      ...player,
      budgetLkr: playerBudgetLkr
    };
    
    // Add player to team
    setTeam(prevTeam => [...prevTeam, playerWithLkr]);
    
    // Update budget
    setRemainingBudget(prev => prev - playerBudgetLkr);
    setSpentBudget(prev => prev + playerBudgetLkr);
    
    // Publish budget update event
    eventService.publish(EVENTS.BUDGET_UPDATED, {
      remainingBudget: remainingBudget - playerBudgetLkr,
      spentBudget: spentBudget + playerBudgetLkr
    });
    
    return true;
  };

  const removePlayer = (playerId: string) => {
    const playerToRemove = team.find(player => player.id === playerId);
    if (!playerToRemove) return;
    
    const playerBudgetLkr = playerToRemove.budgetLkr || playerToRemove.budget * 100000000;
    
    setTeam(prevTeam => prevTeam.filter(player => player.id !== playerId));
    setRemainingBudget(prev => prev + playerBudgetLkr);
    setSpentBudget(prev => prev - playerBudgetLkr);
    
    // Publish budget update event
    eventService.publish(EVENTS.BUDGET_UPDATED, {
      remainingBudget: remainingBudget + playerBudgetLkr,
      spentBudget: spentBudget - playerBudgetLkr
    });
  };

  return (
    <TeamContext.Provider value={{
      team,
      setTeam,
      remainingBudget,
      spentBudget,
      addPlayer,
      removePlayer,
      calculatePoints
    }}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
}
