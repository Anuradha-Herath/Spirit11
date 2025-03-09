"use client";

import React, { useEffect, useState } from 'react';
import TeamSelector from '@/components/TeamSelector';
import { User } from '@/types/user';

const TeamPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/user'); // Adjust the API endpoint as necessary
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Select Your Team</h1>
      {user ? (
        <TeamSelector user={user} />
      ) : (
        <div>Please log in to select your team.</div>
      )}
    </div>
  );
};

export default TeamPage;