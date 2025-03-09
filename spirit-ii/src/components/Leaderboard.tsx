import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '../lib/utils/fetcher';

const Leaderboard = () => {
  const { data, error } = useSWR('/api/teams', fetcher);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    if (data) {
      setLeaderboard(data);
    }
  }, [data]);

  if (error) return <div>Error loading leaderboard.</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Rank</th>
            <th className="py-2 px-4 border-b">Username</th>
            <th className="py-2 px-4 border-b">Total Points</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user, index) => (
            <tr key={user.username}>
              <td className="py-2 px-4 border-b">{index + 1}</td>
              <td className="py-2 px-4 border-b">{user.username}</td>
              <td className="py-2 px-4 border-b">{user.totalPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;