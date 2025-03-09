import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TournamentPage = () => {
  const [tournamentData, setTournamentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        const response = await axios.get('/api/tournament');
        setTournamentData(response.data);
      } catch (err) {
        setError('Failed to fetch tournament data');
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Tournament Summary</h1>
      <div className="mt-4">
        <h2 className="text-xl">Total Runs: {tournamentData.totalRuns}</h2>
        <h2 className="text-xl">Total Wickets: {tournamentData.totalWickets}</h2>
        <h2 className="text-xl">Top Scorers: {tournamentData.topScorers.join(', ')}</h2>
        <h2 className="text-xl">Top Wicket-Takers: {tournamentData.topWicketTakers.join(', ')}</h2>
      </div>
    </div>
  );
};

export default TournamentPage;