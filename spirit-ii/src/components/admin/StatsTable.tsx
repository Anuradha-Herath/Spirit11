import React from 'react';
import { Player } from '../../types/player';

interface StatsTableProps {
  players: Player[];
}

const StatsTable: React.FC<StatsTableProps> = ({ players }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Category</th>
            <th className="py-2 px-4 border-b">Total Runs</th>
            <th className="py-2 px-4 border-b">Balls Faced</th>
            <th className="py-2 px-4 border-b">Wickets</th>
            <th className="py-2 px-4 border-b">Overs Bowled</th>
            <th className="py-2 px-4 border-b">Points</th>
            <th className="py-2 px-4 border-b">Value</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.name}>
              <td className="py-2 px-4 border-b">{player.name}</td>
              <td className="py-2 px-4 border-b">{player.category}</td>
              <td className="py-2 px-4 border-b">{player.totalRuns}</td>
              <td className="py-2 px-4 border-b">{player.ballsFaced}</td>
              <td className="py-2 px-4 border-b">{player.wickets}</td>
              <td className="py-2 px-4 border-b">{player.oversBowled}</td>
              <td className="py-2 px-4 border-b">{player.points}</td>
              <td className="py-2 px-4 border-b">{player.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StatsTable;