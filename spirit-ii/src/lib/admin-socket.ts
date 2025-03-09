/**
 * Mock WebSocket service for simulating real-time updates in the admin panel
 */

type Listener = (data: any) => void;
type Unsubscribe = () => void;

// Event types that can be emitted
export const ADMIN_EVENTS = {
  PLAYER_UPDATED: 'player-updated',
  PLAYER_CREATED: 'player-created',
  PLAYER_DELETED: 'player-deleted',
  STATS_UPDATED: 'stats-updated',
  TOURNAMENT_UPDATED: 'tournament-updated'
};

class AdminSocketService {
  private listeners: Map<string, Set<Listener>> = new Map();
  private isConnected: boolean = false;
  
  // Simulated connection establishment
  connect(): Promise<boolean> {
    return new Promise((resolve) => {
      console.log('Establishing admin socket connection...');
      setTimeout(() => {
        this.isConnected = true;
        console.log('Admin socket connected successfully');
        resolve(true);
      }, 500);
    });
  }
  
  // Subscribe to an event
  subscribe(eventName: string, callback: Listener): Unsubscribe {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    
    const eventListeners = this.listeners.get(eventName)!;
    eventListeners.add(callback);
    
    console.log(`Subscribed to admin event: ${eventName}`);
    
    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(eventName);
      if (listeners) {
        listeners.delete(callback);
        console.log(`Unsubscribed from admin event: ${eventName}`);
      }
    };
  }
  
  // Emit an event (internal use or for testing)
  emit(eventName: string, data: any): void {
    console.log(`Emitting admin event: ${eventName}`, data);
    
    if (!this.isConnected) {
      console.warn('Socket not connected, cannot emit event');
      return;
    }
    
    const listeners = this.listeners.get(eventName);
    if (!listeners || listeners.size === 0) {
      console.log(`No listeners for event: ${eventName}`);
      return;
    }
    
    listeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in event listener:', error);
      }
    });
  }
  
  // Disconnect the socket
  disconnect(): void {
    this.isConnected = false;
    this.listeners.clear();
    console.log('Admin socket disconnected');
  }
  
  // For demonstration purposes: simulate random player stat updates
  simulateStatUpdate(playerId?: string): void {
    // Generate a random player ID if none provided
    const id = playerId || String(Math.floor(Math.random() * 6) + 1);
    
    // Create random stat changes
    const stats = {
      runs: Math.floor(Math.random() * 50),
      wickets: Math.floor(Math.random() * 3),
      batting_average: +(Math.random() * 5).toFixed(2),
      economy: +(Math.random() * 0.5).toFixed(2)
    };
    
    // Get auth token for API requests
    const userData = localStorage.getItem("user");
    let authHeader = '';
    if (userData) {
      const user = JSON.parse(userData);
      authHeader = `Bearer ${user.username}`;
    }
    
    // Update the database
    fetch(`/api/admin/players/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(stats)
    }).catch(err => console.error('Error updating player stats:', err));
    
    // Also emit the event for real-time UI updates
    this.emit(ADMIN_EVENTS.STATS_UPDATED, {
      playerId: id,
      timestamp: new Date().toISOString(),
      stats
    });
  }

  // Simulate various types of real-time updates for demonstration
  simulateRandomUpdate(): void {
    const updateType = Math.floor(Math.random() * 3);
    
    switch (updateType) {
      case 0:
        this.simulateStatUpdate();
        break;
      case 1:
        this.simulateTournamentUpdate();
        break;
      case 2:
        this.simulatePlayerUpdate();
        break;
    }
  }
  
  // For demonstration purposes: simulate tournament updates
  simulateTournamentUpdate(): void {
    // Update tournament progress or statistics
    const completedPercentage = Math.min(100, Math.floor(Math.random() * 20) + 60);
    const extraMatches = Math.floor(Math.random() * 5);
    const extraRuns = Math.floor(Math.random() * 200);
    const extraWickets = Math.floor(Math.random() * 10);
    
    const updateData = {
      completed_percentage: completedPercentage,
      total_matches: 15 + extraMatches,
      total_runs: 5430 + extraRuns,
      total_wickets: 162 + extraWickets,
      type: "stats"
    };
    
    // Get auth token for API requests
    const userData = localStorage.getItem("user");
    let authHeader = '';
    if (userData) {
      const user = JSON.parse(userData);
      authHeader = `Bearer ${user.username}`;
    }
    
    // Update the database
    fetch('/api/admin/tournament', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(updateData)
    }).catch(err => console.error('Error updating tournament stats:', err));
    
    // Also emit the event for real-time UI updates
    this.emit(ADMIN_EVENTS.TOURNAMENT_UPDATED, {
      ...updateData,
      timestamp: new Date().toISOString()
    });
  }
  
  // For demonstration purposes: simulate player profile updates
  simulatePlayerUpdate(): void {
    const id = String(Math.floor(Math.random() * 6) + 1);
    const names = ["Kasun Perera", "Amal Silva", "Nuwan Pradeep", "Dinesh Chandimal", "Lahiru Kumara", "Kusal Mendis"];
    
    this.emit(ADMIN_EVENTS.PLAYER_UPDATED, {
      playerId: id,
      name: names[parseInt(id) - 1],
      timestamp: new Date().toISOString(),
      message: "Player profile updated"
    });
  }
}

// Create and export a singleton instance
export const adminSocket = new AdminSocketService();
