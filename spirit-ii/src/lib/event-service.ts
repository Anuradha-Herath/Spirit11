// Event types
export const EVENTS = {
  TEAM_UPDATED: 'team-updated',
  PLAYER_STATS_UPDATED: 'player-stats-updated',
  BUDGET_UPDATED: 'budget-updated',
  POINTS_UPDATED: 'points-updated',
};

class EventService {
  // Subscribe to an event
  subscribe(eventName: string, callback: Function): () => void {
    const handler = (event: CustomEvent) => {
      callback(event.detail);
    };
    
    window.addEventListener(eventName, handler as EventListener);
    
    // Return unsubscribe function
    return () => {
      window.removeEventListener(eventName, handler as EventListener);
    };
  }

  // Publish an event
  publish(eventName: string, data: any): void {
    const event = new CustomEvent(eventName, {
      detail: data,
      bubbles: true
    });
    window.dispatchEvent(event);
    console.log(`Event published: ${eventName}`, data);
  }
}

// Create singleton instance
export const eventService = new EventService();

// Helper function to create custom hook for event subscription
export function createEventHook(eventName: string) {
  return function useEventSubscription(callback: Function) {
    return eventService.subscribe(eventName, callback);
  };
}
