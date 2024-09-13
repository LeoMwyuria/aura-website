import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { ScriptableContext } from 'chart.js';
import auralogo from '../../assets/auraSymbol.png';

interface UserProfileModalProps {
  user: {
    name: string;
    aura: number;
    image: string;
  };
  onClose: () => void;
}

interface AuraData {
  aura: number;
  comment: string;
  event_date: string;
  username: string;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose }) => {
  const [auraData, setAuraData] = useState<AuraData[]>([]);
  const isPositiveAura = true;
  
  useEffect(() => {
    const fetchAuraData = async () => {
      try {
        const response = await axios.get(`https://aura-api-519230006497.europe-west2.run.app/dashboard/${user.name}`);
        setAuraData(response.data.historical_changes);
      } catch (error) {
        console.error("Error fetching aura data", error);
      }
    };

    fetchAuraData();
  }, [user.name]);

  const createGradient = (ctx: CanvasRenderingContext2D, isPositiveAura: boolean) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    if (isPositiveAura) {
      gradient.addColorStop(0, 'rgba(76, 175, 80, 0.5)');
      gradient.addColorStop(1, 'rgba(76, 175, 80, 0)');
    } else {
      gradient.addColorStop(0, 'rgba(244, 67, 54, 0.5)');
      gradient.addColorStop(1, 'rgba(244, 67, 54, 0)');
    }
    return gradient;
  };

  const auraColorClass1 = isPositiveAura ? "#34d399" : "#ef4444";

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
      onClick={handleBackgroundClick}
    >
      <div 
        className="bg-white p-8 rounded-3xl h-[60%] max-w-md w-full relative border border-gray-400 modal-scale-in" 
        onClick={(e) => e.stopPropagation()}
      >
        <button className="absolute top-4 right-4 text-2xl" onClick={onClose}>×</button>
        <div className="flex flex-col items-center">
          <img src={user.image} alt="User Avatar" className="h-16 w-16 rounded-full mb-4" />
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <div className="flex items-center mt-2">
            <img src={auralogo} alt="Aura Logo" className="h-6 w-6 mr-2" />
            <span className="text-xl font-semibold">{user.aura} aura</span>
          </div>
          <p className="text-center mt-4">"You either win or you get seventh place."</p>
          <div className="flex items-center justify-center mt-4">
            <span className="px-2 py-1 bg-green-200 rounded-full text-sm mr-2">Verified Lion</span>
            <span className="px-2 py-1 bg-blue-200 rounded-full text-sm mr-2">Big spender</span>
            <span className="px-2 py-1 bg-yellow-200 rounded-full text-sm">Up recently</span>
          </div>

          <div className="mt-6 w-full">
            <h3 className="text-lg font-bold">Recent Aura Changes</h3>
            <div className="mt-2 h-64">
              {auraData.length > 0 ? (
                <Line
                  data={{
                    labels: auraData.map((entry) => new Date(entry.event_date).toLocaleDateString()), 
                    datasets: [{
                      label: "Aura Progress",
                      data: auraData.map((entry) => entry.aura),
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
                        display: true,
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
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
