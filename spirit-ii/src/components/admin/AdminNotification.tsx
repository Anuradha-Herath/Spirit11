"use client";

import { useState, useEffect } from 'react';
import { adminSocket, ADMIN_EVENTS } from '@/lib/admin-socket';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
}

export default function AdminNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to admin socket when component mounts
    adminSocket.connect()
      .then(() => setIsConnected(true))
      .catch(err => console.error("Failed to connect to admin socket:", err));
    
    // Listen for player updates
    const playerUpdatedUnsubscribe = adminSocket.subscribe(
      ADMIN_EVENTS.PLAYER_UPDATED,
      (data) => {
        addNotification({
          message: `Player ${data.name || data.playerId} updated`,
          type: 'info'
        });
      }
    );
    
    // Listen for stat updates
    const statsUpdatedUnsubscribe = adminSocket.subscribe(
      ADMIN_EVENTS.STATS_UPDATED,
      (data) => {
        addNotification({
          message: `Player ${data.playerId} statistics updated`,
          type: 'success'
        });
      }
    );
    
    // Listen for tournament updates
    const tournamentUpdatedUnsubscribe = adminSocket.subscribe(
      ADMIN_EVENTS.TOURNAMENT_UPDATED,
      (data) => {
        addNotification({
          message: `Tournament data updated - ${data.type || 'General update'}`,
          type: 'warning'
        });
      }
    );

    // Clean up on unmount
    return () => {
      playerUpdatedUnsubscribe();
      statsUpdatedUnsubscribe();
      tournamentUpdatedUnsubscribe();
    };
  }, []);
  
  const addNotification = ({ message, type = 'info' }: { message: string, type?: 'info' | 'success' | 'warning' | 'error' }) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date()
    };
    
    setNotifications(prev => [newNotification, ...prev].slice(0, 5)); // Keep last 5 notifications
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  };

  if (!isConnected || notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 space-y-2">
      {notifications.map((notification) => (
        <div 
          key={notification.id} 
          className={`p-3 rounded-lg shadow-lg animate-fade-in bg-opacity-95 ${
            notification.type === 'info' ? 'bg-blue-600 text-white' :
            notification.type === 'success' ? 'bg-green-600 text-white' :
            notification.type === 'warning' ? 'bg-yellow-500 text-white' :
            'bg-red-600 text-white'
          }`}
        >
          <div className="flex justify-between items-center">
            <div className="flex-1">{notification.message}</div>
            <button 
              onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
              className="ml-2 text-white opacity-70 hover:opacity-100"
            >
              &times;
            </button>
          </div>
          <div className="text-xs opacity-70 mt-1">
            {notification.timestamp.toLocaleTimeString()}
          </div>
        </div>
      ))}
    </div>
  );
}
