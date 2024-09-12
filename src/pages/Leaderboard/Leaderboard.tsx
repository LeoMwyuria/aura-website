import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Footer from "../../components/Footer/LeaderBoardFooter";
import leaderboardPicture from '../../assets/leaderboardPicture.png';
import auralogo from '../../assets/auraSymbol.png';
import userGreen from '../../assets/userGreen.png';
import userPurple from '../../assets/userPurple.png';
import userOrange from '../../assets/userOrange.png';
import DashboardHeader from "../../components/Header/Header";
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';

interface LeaderboardEntry {
  rank: number;
  name: string;
  aura: number;
  unique_id: string;
  image: string;
}

const Leaderboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Memoized rank styles to prevent re-calculation on each render
  const rankStyles = useMemo(() => (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-leaderboard-first-bg text-leaderboard-first border-leaderboard-first-border text-base';
      case 2:
        return 'bg-leaderboard-second-bg text-leaderboard-second border-leaderboard-second-border text-base';
      case 3:
        return 'bg-leaderboard-third-bg text-leaderboard-third border-leaderboard-third-border text-base';
      default:
        return 'bg-transparent text-black border-none text-base';
    }
  }, []);

  // Fetch profile picture from Firestore
  const fetchProfilePicture = useCallback(async (uid: string) => {
    const userRef = doc(firestore, `users/${uid}`);
    try {
      const docSnap = await getDoc(userRef);
      return docSnap.exists() ? docSnap.data()?.profilePicture || null : null;
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      return null;
    }
  }, []);

  // Fetch leaderboard data from API
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      // Use sessionStorage to cache leaderboard data to avoid refetching
      const cachedData = sessionStorage.getItem('leaderboardData');
      if (cachedData) {
        setLeaderboardData(JSON.parse(cachedData));
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('https://aura-api-519230006497.europe-west2.run.app/world-ranking');
        const jsonData: [string, [number, string]][] = await response.json();

        // Fetch profile pictures in parallel and batch data updates
        const formattedData = await Promise.all(jsonData.map(async (entry, index) => {
          const [name, [aura, unique_id]] = entry;
          const profilePicture = await fetchProfilePicture(unique_id);
          return {
            rank: index + 1,
            name,
            aura,
            unique_id,
            image: profilePicture || (index % 3 === 0 ? userOrange : index % 2 === 0 ? userGreen : userPurple)
          };
        }));

        // Sort the leaderboard by aura and limit to top 10 entries
        const sortedData = formattedData.sort((a, b) => b.aura - a.aura).slice(0, 10);
        setLeaderboardData(sortedData);

        // Cache the sorted leaderboard data
        sessionStorage.setItem('leaderboardData', JSON.stringify(sortedData));

        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load leaderboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [fetchProfilePicture]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-bold">Loading leaderboard data...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-4">{error}</div>;
  }

  return (
    <div className="relative min-h-screen">
      <DashboardHeader />
      <main className="flex flex-col flex-grow pb-10"> 
        <div className="flex flex-col justify-center items-center py-4">
          <img src={leaderboardPicture} className="w-[11%] mx-auto" alt="Leaderboard" />
          <p className="text-4xl font-semibold mx-auto">Worldwide Aura Leaderboard</p>
          
          <div className="mt-8 w-full max-w-xl mx-auto border border-gray-300 rounded-t-3xl shadow-custom p-4 relative z-10">
            <div className="relative">
              <div className="flex flex-col">
                {leaderboardData.map((entry, index) => (
                  <div key={index} className={`flex items-center justify-between border-b border-gray-300 py-3 px-4 ${entry.rank === leaderboardData.length ? 'pb-16' : ''}`}>
                    <div className="flex items-center">
                      <span className={`h-7 w-7 flex items-center justify-center rounded-full font-bold ${rankStyles(entry.rank)} border border-solid`}>
                        {entry.rank}
                      </span>
                      
                      <img loading="lazy" src={entry.image} alt="User Avatar" className="h-8 w-8 rounded-full border border-gray-300 mx-4" />
                      <span className="text-lg font-bold">{entry.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-bold mr-2">{entry.aura}</span>
                      <img src={auralogo} alt="Aura Logo" className="h-6 w-6 mr-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Leaderboard;
