import React from 'react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Player } from '@/types/player';
import StatsTable from '@/components/admin/StatsTable';

const AdminPage = () => {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      const response = await fetch('/api/players');
      const data = await response.json();
      setPlayers(data);
      setLoading(false);
    };

    fetchPlayers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <h2 className="text-xl font-semibold mb-2">Players</h2>
      <StatsTable players={players} />
    </div>
  );
};

export default AdminPage;