import React, { useEffect, useState } from 'react';
import PlayerForm from '../../../components/admin/PlayerForm';
import StatsTable from '../../../components/admin/StatsTable';

const PlayersPage = () => {
  const [players, setPlayers] = useState([]);
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

  const handlePlayerAdd = async (newPlayer) => {
    const response = await fetch('/api/players', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPlayer),
    });

    if (response.ok) {
      const addedPlayer = await response.json();
      setPlayers((prevPlayers) => [...prevPlayers, addedPlayer]);
    }
  };

  const handlePlayerUpdate = async (updatedPlayer) => {
    const response = await fetch(`/api/players/${updatedPlayer.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedPlayer),
    });

    if (response.ok) {
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.id === updatedPlayer.id ? updatedPlayer : player
        )
      );
    }
  };

  const handlePlayerDelete = async (playerId) => {
    const response = await fetch(`/api/players/${playerId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setPlayers((prevPlayers) => prevPlayers.filter((player) => player.id !== playerId));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Players Management</h1>
      <PlayerForm onAdd={handlePlayerAdd} />
      <StatsTable players={players} onUpdate={handlePlayerUpdate} onDelete={handlePlayerDelete} />
    </div>
  );
};

export default PlayersPage;