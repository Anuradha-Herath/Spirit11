import React, { useState, useEffect } from 'react';
import { Player } from '../types/player';
import { fetchPlayers } from '../lib/database';

const TeamSelector: React.FC = () => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
    const [budget, setBudget] = useState<number>(9000000);
    const [totalPoints, setTotalPoints] = useState<number>(0);

    useEffect(() => {
        const loadPlayers = async () => {
            const playerData = await fetchPlayers();
            setPlayers(playerData);
        };
        loadPlayers();
    }, []);

    const handlePlayerSelect = (player: Player) => {
        if (selectedPlayers.includes(player)) {
            setSelectedPlayers(selectedPlayers.filter(p => p !== player));
        } else {
            const newTotal = selectedPlayers.reduce((sum, p) => sum + p.value, 0) + player.value;
            if (newTotal <= budget) {
                setSelectedPlayers([...selectedPlayers, player]);
            } else {
                alert('Budget exceeded!');
            }
        }
        calculateTotalPoints();
    };

    const calculateTotalPoints = () => {
        const points = selectedPlayers.reduce((sum, player) => sum + player.points, 0);
        setTotalPoints(points);
    };

    return (
        <div className="team-selector">
            <h2 className="text-xl font-bold">Select Your Team</h2>
            <div className="budget-info">
                <p>Budget: Rs. {budget}</p>
                <p>Total Points: {totalPoints}</p>
            </div>
            <div className="player-list">
                {players.map(player => (
                    <div key={player.name} className="player-item">
                        <span>{player.name} - {player.category} - Rs. {player.value}</span>
                        <button onClick={() => handlePlayerSelect(player)}>
                            {selectedPlayers.includes(player) ? 'Remove' : 'Select'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamSelector;