import React, { useState } from 'react';
import { Player } from '../../types/player';

interface PlayerFormProps {
  player?: Player;
  onSubmit: (player: Player) => void;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ player, onSubmit }) => {
  const [name, setName] = useState(player?.name || '');
  const [university, setUniversity] = useState(player?.university || '');
  const [category, setCategory] = useState(player?.category || 'Batsman');
  const [totalRuns, setTotalRuns] = useState(player?.totalRuns || 0);
  const [ballsFaced, setBallsFaced] = useState(player?.ballsFaced || 0);
  const [wickets, setWickets] = useState(player?.wickets || 0);
  const [oversBowled, setOversBowled] = useState(player?.oversBowled || 0);
  const [runsConceded, setRunsConceded] = useState(player?.runsConceded || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlayer: Player = {
      name,
      university,
      category,
      totalRuns,
      ballsFaced,
      wickets,
      oversBowled,
      runsConceded,
      points: 0, // Points will be calculated later
      value: 0,  // Value will be calculated later
      readOnly: false, // New players are not read-only
    };
    onSubmit(newPlayer);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
          required
        />
      </div>
      <div>
        <label className="block">University</label>
        <input
          type="text"
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
          className="input"
          required
        />
      </div>
      <div>
        <label className="block">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input"
        >
          <option value="Batsman">Batsman</option>
          <option value="Bowler">Bowler</option>
          <option value="All-Rounder">All-Rounder</option>
        </select>
      </div>
      <div>
        <label className="block">Total Runs</label>
        <input
          type="number"
          value={totalRuns}
          onChange={(e) => setTotalRuns(Number(e.target.value))}
          className="input"
          required
        />
      </div>
      <div>
        <label className="block">Balls Faced</label>
        <input
          type="number"
          value={ballsFaced}
          onChange={(e) => setBallsFaced(Number(e.target.value))}
          className="input"
          required
        />
      </div>
      <div>
        <label className="block">Wickets</label>
        <input
          type="number"
          value={wickets}
          onChange={(e) => setWickets(Number(e.target.value))}
          className="input"
          required
        />
      </div>
      <div>
        <label className="block">Overs Bowled</label>
        <input
          type="number"
          value={oversBowled}
          onChange={(e) => setOversBowled(Number(e.target.value))}
          className="input"
          required
        />
      </div>
      <div>
        <label className="block">Runs Conceded</label>
        <input
          type="number"
          value={runsConceded}
          onChange={(e) => setRunsConceded(Number(e.target.value))}
          className="input"
          required
        />
      </div>
      <button type="submit" className="btn">
        {player ? 'Update Player' : 'Add Player'}
      </button>
    </form>
  );
};

export default PlayerForm;