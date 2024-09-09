import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import 'toastify-js/src/toastify.css';
import Footer from './components/Footer/Footer';
import DashboardHeader from './components/Header/DashboardHeader';
import auralogo from './assets/auraSymbol.png';
import greenAuraSymbol from './assets/greenAuraSymbol.png';
import redAuraSymbol from './assets/redAuraSymbol.png';
import userGreen from './assets/userGreen.png';
import userPurple from './assets/userPurple.png';
import userOrange from './assets/userOrange.png';
import disputeLogo from './assets/disputesLogo.png';
import threeAuraLogo from './assets/3AuraLogo.png';
import YourNetwork3Logo from './assets/YourNetwork3Logo.png';
import upGraph from './assets/upGraph.png'; 
import downGraph from './assets/downGraph.png'; 

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const App: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;


    if (user) {
      const db = getDatabase();
      const userRef = ref(db, 'users/' + user.uid);

      console.log("User ID:", user.uid);

      const unsubscribe = onValue(userRef, (snapshot) => {
        const data = snapshot.val();

        if (data && data.username) {
          setUsername(data.username);
        } else {
          console.error("No username found for this user.");
          setUsername('No username found');
        }
      }, (error) => {
        console.error("Error fetching data:", error);
        setUsername('Error fetching data');
      });

      return () => unsubscribe();
    } else {
      console.error("No authenticated user found.");
      setUsername('Not authenticated');
    }
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://aura-api-519230006497.europe-west2.run.app/dashboard/LeoMwyuria');
        const jsonData = await response.json();
        console.log(jsonData); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const auraData = [
    { value: '-100', date: '09/24/2024' },
    { value: '-50', date: '09/21/2024' },
    { value: '+5', date: '09/20/2024' },
    { value: '-20', date: '09/18/2024' },
    { value: '+30', date: '09/16/2024' },
    { value: '-10', date: '09/12/2024' },
  ];

  const networkData = [
    { name: 'Alice Anderson', aura: '1100', change: '+100', image: userPurple },
    { name: 'Bob Brown', aura: '1450', change: '-50', image: userOrange },
    { name: 'Charlie Clark', aura: '980', change: '+20', image: userGreen },
    { name: 'Diana Davis', aura: '660', change: '-80', image: userPurple },
    { name: 'Eve Evans', aura: '600', change: '+30', image: userGreen },
  ];

  const auraProgressData = {
    labels: auraData.map((data) => data.date),
    datasets: [
      {
        label: 'Aura Progress',
        data: auraData.map((data) => parseInt(data.value)),
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const auraProgressOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Your Aura Progress',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <>
      <DashboardHeader />
      <div className="p-5 bg-gray-100 min-h-screen">
        <section className="text-center mt-10">
          <h1 className="text-4xl font-bold">Welcome back, {username}</h1>
          <div className="grid grid-cols-2 grid-rows-2 gap-6 mt-8 w-[50%] mx-auto">
            <div className="bg-white shadow-md p-6 rounded-3xl col-span-1 row-span-2 border">
              <p className="font-bold text-gray-700 text-left">You have</p>
              <p className="text-4xl font-extrabold text-black flex items-center">
                <img src={auralogo} alt="Aura Symbol" className="inline h-6 w-6 mr-2" />
                300 aura
              </p>
            </div>
            <div className="bg-white shadow-md p-6 rounded-3xl col-span-1 row-span-2 border">
              <p className="font-bold text-gray-700 text-left">Your personal aura record (PAR)</p>
              <p className="text-4xl font-extrabold text-black flex items-center">
                <img src={auralogo} alt="Aura Symbol" className="inline h-6 w-6 mr-2" />
                1 500 aura
              </p>
            </div>
            <div className="bg-white shadow-md p-6 rounded-3xl col-span-1 row-span-2 flex flex-col justify-between border">
              <p className="font-bold text-gray-700 text-2xl text-left mb-8">Recent aura activity</p>
              <ul className="space-y-4 overflow-y-auto flex-1 ">
                {auraData.map((entry, index) => (
                  <li key={index} className="flex justify-between items-center text-lg ">
                    <span className="font-bold flex items-center text-black">
                      <img
                        src={entry.value.startsWith('-') ? redAuraSymbol : greenAuraSymbol}
                        alt="Aura Symbol"
                        className="inline h-6 w-6 mr-2"
                      />
                      {entry.value} aura
                    </span>
                    <span className="text-gray-600">{entry.date}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white shadow-md p-6 rounded-3xl col-span-1 row-span-1">
              <p className="font-bold text-gray-700 text-left">Last month you had</p>
              <div className="flex items-center space-x-4">
                <p className="text-4xl font-extrabold text-black flex items-center">
                  <img src={redAuraSymbol} alt="Aura Symbol" className="inline h-6 w-6 mr-2" />
                  800 aura
                </p>
                <span className="text-red-500 text-xl flex items-center">
                  -500 aura
                </span>
              </div>
              <div className="mt-5 h-32 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Graph Placeholder</span>
              </div>
            </div>
            <div className="bg-white shadow-md p-6 rounded-3xl col-span-1 row-span-1">
              <p className="font-bold text-gray-700 text-left">Current aura disputes</p>
              <p className="text-4xl font-extrabold text-black flex items-center">
                <img src={disputeLogo} alt="Dispute Icon" className="inline h-6 w-6 mr-2" />
                2
              </p>
            </div>
          </div>
        </section>

        <section className="text-center mt-10">
          <img src={threeAuraLogo} className="mx-auto mb-5" alt="Aura Progress Logo" />
          <h2 className="text-2xl font-bold">Your aura progress</h2>
          <p className="text-gray-600">Track how your aura changes throughout time.</p>
          <div className="mt-5 w-[50%] mx-auto flex flex-col justify-center items-end">
            <Line data={auraProgressData} options={auraProgressOptions} />
            <button className="bg-black text-white py-2 mt-4 rounded-3xl w-[10%] text-sm">Dispute</button>
          </div>
        </section>

        <section className="text-center mt-10 mb-5">
  <img src={YourNetwork3Logo} className="mx-auto mb-5" alt="Your Network Logo" />
  <h2 className="text-2xl font-bold">Your network</h2>
  <p className="text-gray-600">See how your friends' aura is changing.</p>
  <div className="bg-white shadow-md p-6 rounded-3xl mt-5 w-[30%] mx-auto">
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
  </div>
</section>
      </div>
      <Footer />
    </>
  );
};

export default App;
