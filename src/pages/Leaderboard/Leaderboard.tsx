import Footer from "../../components/Footer/LeaderBoardFooter";
import Header from "../../components/Header/Header";
import leaderboardPicture from '../../assets/leaderboardPicture.png';
import auralogo from '../../assets/auraSymbol.png';
import userGreen from '../../assets/userGreen.png';
import userPurple from '../../assets/userPurple.png';
import userOrange from '../../assets/userOrange.png';

const Leaderboard = () => {
  const leaderboardData = [
    { rank: 1, name: 'Swiftie Jackson', aura: 2500, image: userOrange },
    { rank: 2, name: 'Alex Doe', aura: 2400, image: userPurple },
    { rank: 3, name: 'Jordan Smith', aura: 2100, image: userGreen },
    { rank: 4, name: 'Swiftie Jackson', aura: 2000, image: userGreen },
    { rank: 5, name: 'Alex Doe', aura: 1900, image: userPurple },
    { rank: 6, name: 'Jordan Smith', aura: 1800, image: userOrange },
    { rank: 7, name: 'Jordan Smith', aura: 1700, image: userPurple },
    { rank: 8, name: 'Swiftie Jackson', aura: 1600, image: userGreen },
    { rank: 9, name: 'Alex Doe', aura: 1500, image: userOrange },
    { rank: 10, name: 'Jordan Smith', aura: 1400, image: userGreen },
  ];

  const rankStyles = (rank: number) => {
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
  };

  return (
    <div className="relative min-h-screen">
      <Header />
      <main className="flex flex-col flex-grow pb-10"> 
        <div className="flex flex-col justify-center items-center py-4">
          <img src={leaderboardPicture} className="w-[11%] mx-auto" alt="Leaderboard" />
          <p className="text-4xl font-semibold mx-auto">Worldwide Aura Leaderboard</p>
          
          <div className="mt-8 w-full max-w-xl mx-auto border border-gray-300 rounded-t-3xl shadow-custom p-4 relative z-10">
            <div className="relative">
              <div className="flex flex-col">
                {leaderboardData.map((entry, index) => (
                  <div key={entry.rank} className={`flex items-center justify-between border-b border-gray-300 py-3 px-4 ${index === leaderboardData.length - 1 ? 'pb-16' : ''}`}>
                    <div className="flex items-center">
                      <span className={`h-7 w-7 flex items-center justify-center rounded-full font-bold ${rankStyles(entry.rank)} border border-solid`}>
                        {entry.rank}
                      </span>
                      <img src={entry.image} alt="User Avatar" className="h-8 w-8 rounded-full border border-gray-300 mx-4" />
                      <span className="text-lg font-bold">{entry.name}</span>
                    </div>
                    <div className="flex items-center">
                      <img src={auralogo} alt="Aura Logo" className="h-6 w-6 mr-2" />
                      <span className="text-sm font-bold">{entry.aura} aura</span>
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