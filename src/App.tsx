import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend,
  ChartData, ChartOptions, Filler, ScriptableContext
} from 'chart.js';
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import 'toastify-js/src/toastify.css';
import Footer from './components/Footer/Footer';
import DashboardHeader from './components/Header/Header';
import auralogo from './assets/auraSymbol.png';
import greenAuraSymbol from './assets/greenAuraSymbol.png';
import redAuraSymbol from './assets/redAuraSymbol.png';
import disputeLogo from './assets/disputesLogo.png';
import threeAuraLogo from './assets/3AuraLogo.png';
import YourNetwork3Logo from './assets/YourNetwork3Logo.png';
import upGraph from './assets/upGraph.png'; 
import downGraph from './assets/downGraph.png'; 
import userGreen from './assets/userGreen.png'
import StarAnimation from './components/StarAnimation/StarAnimation';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface AuraData {
  comment?: any;
  value: string;
  date: string;
}

interface NetworkUser {
  name: string;
  aura: string;
  change: string;
  image: string;
}

interface CurrentAura {
  current_aura: number;
  peek_aura: number;
  dispute: number;
}

const App: React.FC = () => {
  const chartRef = useRef<ChartJS<"line">>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [auraData, setAuraData] = useState<AuraData[]>([]);
  const [networkData, setNetworkData] = useState<NetworkUser[]>([]);
  const [currentAura, setCurrentAura] = useState<CurrentAura | null>(null);
  const [recentActivity, setRecentActivity] = useState<AuraData[]>([]);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    
    const hasVisited = sessionStorage.getItem('hasVisited');

    if (!hasVisited) {

      setShowAnimation(true);

      sessionStorage.setItem('hasVisited', 'true')

      setTimeout(() => {
        setShowAnimation(false);
      }, 1700); 
    }
  }, []);
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const db = getDatabase();
      const userRef = ref(db, 'users/' + user.uid);

      const unsubscribe = onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        setUsername(data?.username || 'No username found');
      }, (error) => {
        console.error("Error fetching data:", error);
        setUsername('Error fetching data');
      });

      return () => unsubscribe();
    } else {
      setUsername('Not authenticated');
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (username) {
      try {
        const response = await fetch(`https://aura-api-519230006497.europe-west2.run.app/dashboard/${username}`);
        const data = await response.json();
  
        const { current_aura, historical_changes, friends } = data;
  
        const cumulativeAuraData = historical_changes.reduce((acc: AuraData[], change: any) => {
          const lastValue = acc.length ? parseInt(acc[acc.length - 1].value) : 0;
          acc.push({
            value: (lastValue + parseInt(change.aura)).toString(),
            date: new Date(change.event_date).toLocaleDateString(),
          });
          return acc;
        }, []);
  
        
        const individualChangesData = historical_changes.map((change: any) => ({
          value: change.aura.toString(),
          date: new Date(change.event_date).toLocaleDateString(),
          comment: change.comment || '' 
        }));
  
        setAuraData(cumulativeAuraData);
        setRecentActivity(individualChangesData);
        setCurrentAura(current_aura);
  
        setNetworkData(friends.map((friend: any) => ({
          name: friend.username,
          aura: (parseInt(friend.aura) + parseInt(friend.change)).toString(),
          change: friend.change,
          image: userGreen,
        })));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  }, [username]);
  

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const chart = chartRef.current;
    if (chart) {
      const ctx = chart.ctx;
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(218, 88, 205, 0.5)');
      gradient.addColorStop(1, 'rgba(218, 88, 205, 0)');

      if (chart.data.datasets[0]) {
        chart.data.datasets[0].backgroundColor = gradient;
      }
      chart.update();
    }
  }, [auraData]);

  const auraProgressData: ChartData<'line'> = useMemo(() => ({
    labels: auraData.map((data) => data.date),
    datasets: [{
      label: 'Aura Progress',
      data: auraData.map((data) => parseInt(data.value)),
      fill: true,
      backgroundColor: '#DA58CD',
      borderColor: '#DA58CD',
      borderWidth: 2,
      pointRadius: 1.5,
      pointBackgroundColor: '#DA58CD',
    }],
  }), [auraData]);

  const auraProgressOptions: ChartOptions<'line'> = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      filler: { propagate: true },
      title: { display: true, text: 'Your Aura Progress' },
    },
    scales: { y: { beginAtZero: false } },
  }), []);

  const createGradient = useCallback((ctx: CanvasRenderingContext2D, isPositive: boolean) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    if (isPositive) {
      gradient.addColorStop(0, 'rgba(76, 175, 80, 0.5)');
      gradient.addColorStop(1, 'rgba(76, 175, 80, 0)');
    } else {
      gradient.addColorStop(0, 'rgba(244, 67, 54, 0.5)');
      gradient.addColorStop(1, 'rgba(244, 67, 54, 0)');
    }
    return gradient;
  }, []);

  const getAura30DaysAgo = useCallback((historicalChanges: AuraData[]): string => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return historicalChanges.find(change => new Date(change.date) <= thirtyDaysAgo)?.value || '0';
  }, []);

  const aura30DaysAgo = useMemo(() => auraData.length ? getAura30DaysAgo(auraData) : '0', [auraData, getAura30DaysAgo]);
  const currentAuraValue = currentAura?.current_aura || 0;
  const isPositiveAura = currentAuraValue >= 0;
  const auraColorClass = isPositiveAura ? 'text-green-500' : 'text-red-500';
  const auraColorClass1 = isPositiveAura ? 'green' : 'red';

  return (
    <>
    {showAnimation && <StarAnimation />}
      <DashboardHeader />
      <div className="p-5 bg-gray-100 min-h-screen">
        <section className="text-center mt-10">
          <h1 className="text-4xl font-bold">Welcome back, {username}</h1>
          <div className="grid grid-cols-2 gap-6 mt-8 w-[45%] max-h-[90%] mx-auto ">
            <div className="bg-white shadow-md p-6 rounded-3xl col-span-1 row-span-2 border">
              <p className="font-bold text-gray-700 text-left">You have</p>
              <p className="text-4xl font-extrabold text-black flex items-center">
              <img src={auralogo} alt="Aura Symbol" className="inline h-6 w-6 mr-2" />
              {currentAura ? currentAura.current_aura : 'Loading...'}
              </p>

            </div>
            <div className="bg-white shadow-md p-6 rounded-3xl col-span-1 row-span-2 border">
              <p className="font-bold text-gray-700 text-left">Your personal aura record (PAR)</p>
              <p className="text-4xl font-extrabold text-black flex items-center">
                <img src={auralogo} alt="Aura Symbol" className="inline h-6 w-6 mr-2" />
                {currentAura ? currentAura.peek_aura : 'Loading...'}
              </p>
            </div>
            <div className="bg-white shadow-md p-6 rounded-3xl col-span-1 row-span-2 flex flex-col justify-between border max-h-[550px] ">
              <p className="font-bold text-gray-700 text-2xl text-left mb-8">Recent aura activity</p>
              <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <ul className="space-y-4">
                  {recentActivity.length ? (
                    recentActivity.slice().reverse().map((entry, index) => {
                      const isLastItem = index === 0;
                      const isPositiveAura = !entry.value.startsWith('-');
                      const auraValue = isPositiveAura ? `+${entry.value}` : entry.value;
                      const auraColorClass = isPositiveAura ? 'text-green-500' : 'text-red-500';
                      const listItemClass = isLastItem ? 'text-3xl font-bold' : 'text-lg';

                      return (
                        <li key={index} className={`flex items-center border-b border-gray-400 w-[70%] relative group ${listItemClass}`}>
                          <span className={`font-bold flex items-center ${auraColorClass}`}>
                            <img
                              src={isPositiveAura ? greenAuraSymbol : redAuraSymbol}
                              alt="Aura Symbol"
                              className={isLastItem ? 'w-9 h-9' : 'inline h-6 w-6 mr-2'}
                            />
                            {auraValue} aura
                          </span>

                          {!isLastItem && <span className="text-gray-600 ml-1">{entry.date}</span>}

                          {entry.comment ? (
                            <div className="absolute hidden group-hover:block bg-custom-purple text-white text-sm rounded-md p-2 left-1/2 transform -translate-x-1/2 max-w-[200px] whitespace-normal">
                              {entry.comment}
                            </div>
                          ) : (
                            <div className="absolute hidden group-hover:block bg-custom-purple text-white text-sm rounded-md p-2 left-1/2 transform -translate-x-1/2 max-w-[200px] whitespace-normal">
                              No Comment
                            </div>
                          )}
                        </li>
                      );
                    })
                  ) : (
                    <li className="text-gray-600">No recent aura activity</li>
                  )}
                </ul>
              </div>
            </div>





          <div className="bg-white shadow-md p-6 rounded-3xl col-span-1 row-span-1 max-h-[90%]">
        <p className="font-bold text-gray-700 text-left">Last month you had</p>
        <div className="flex items-center space-x-4">
        <p className={`text-4xl font-extrabold flex items-center`}>
  <img src={auralogo} alt="Aura Symbol" className="inline h-6 w-6 mr-2" />
  {aura30DaysAgo}
</p>
    <span className={`${auraColorClass} text-xl flex items-center`}>
      {auraData.length ? `${currentAuraValue - parseInt(aura30DaysAgo)} aura` : '0'}
    </span>
        </div>
        <div className="mt-5 h-64 flex items-center justify-center rounded-lg">
        {auraData.length > 0 ? (
          <Line
            data={{
              labels: auraData.map((entry) => entry.date),
              datasets: [{
                label: 'Aura Progress',
                data: auraData.map((entry) => parseInt(entry.value)),
                fill: true,
                backgroundColor: (context: ScriptableContext<"line">) => {
                  const { ctx } = context.chart;
                  return createGradient(ctx, isPositiveAura);
                },
                borderColor: auraColorClass1,
                borderWidth: 2,
                pointRadius: 0,
              }],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: false,
                },
              },
              scales: {
                x: {
                  display: false,
                },
                y: {
                  display: true,
                  beginAtZero: false,
                },
              },
              elements: {
                line: {
                  borderJoinStyle: 'round',
                },
              },
              layout: {
                padding: {
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                },
              },
            }}
          />
        ) : (
          <span className="text-gray-500">No data available</span>
        )}
      </div>

      </div>
            <div className="bg-white shadow-md p-6 rounded-3xl col-span-1 row-span-1">
              <p className="font-bold text-gray-700 text-left">Current aura disputes</p>
              <p className="text-4xl font-extrabold text-black flex items-center">
                <img src={disputeLogo} alt="Dispute Icon" className="inline h-6 w-6 mr-2" />
                {currentAura ? currentAura.dispute : 'Loading...'}
              </p>
            </div>
          </div>
        </section>

        <section className="text-center mt-10">
          <img src={threeAuraLogo} className="mx-auto mb-5" alt="Aura Progress Logo" />
          <h2 className="text-2xl font-bold">Your aura progress</h2>
          <p className="text-gray-600">Track how your aura changes throughout time.</p>
          <div className="mt-5 w-[50%] mx-auto flex flex-col justify-center items-end">
          <Line ref={chartRef} data={auraProgressData} options={auraProgressOptions} />
            <button className="bg-black text-white py-2 mt-4 rounded-3xl w-[10%] text-sm">Dispute</button>
          </div>
        </section>

        <section className="text-center mt-10 mb-5">
          <img src={YourNetwork3Logo} className="mx-auto mb-5" alt="Your Network Logo" />
          <h2 className="text-2xl font-bold">Your network</h2>
          <p className="text-gray-600">See how your friends' aura is changing.</p>
          <div className="bg-white shadow-md p-6 rounded-3xl mt-5 w-[30%] mx-auto">
            {networkData.length > 0 ? (
              <table className="w-full text-left">
                <tbody>
                  {networkData.map((user, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 text-sm font-bold text-gray-600">
                        {index + 1}
                      </td>
                      <td className="py-2">
                        <img
                          src={user.image}
                          alt="User Avatar"
                          className="h-8 w-8 rounded-full border border-gray-300 mr-2"
                        />
                      </td>
                      <td className="py-2 text-lg">{user.name}</td>
                      <td className="py-2 flex items-center justify-between text-lg">
                        <div>
                          <img src={auralogo} alt="Aura Logo" className="inline h-4 w-4 mr-1" />
                          {user.aura} aura
                        </div>
                        <div>
                          {user.change.startsWith('-') ? (
                            <img src={downGraph} alt="Downward Trend" className="h-6 w-6" />
                          ) : (
                            <img src={upGraph} alt="Upward Trend" className="h-6 w-6" />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600">No friends in your network</p>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default App;
