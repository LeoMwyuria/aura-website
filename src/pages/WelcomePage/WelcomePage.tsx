import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import welcomePagePicture from '../../assets/AuraWelcomePage.png';
import auraSymbol from '../../assets/auraSymbol.png';

import Button from '../../components/Button/Button';
import Footer from "../../components/Footer/Footer";
import ScrollToTopButton from "../../components/ScrollToTop/ScrollToTop";
import StarAnimation from "../../components/StarAnimation/StarAnimation";
import DashboardHeader from "../../components/Header/Header";

const WelcomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigation = useNavigate();

  const toSignUpClick = () => {
    navigation('/signup');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1860);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <StarAnimation />
      <DashboardHeader />
      <main className={`flex-grow ${isVisible ? 'fade-in' : 'opacity-0'}`}>
        <div className="h-auto md:h-[40%] flex flex-col justify-center items-center text-center mt-5 px-4">
          <div className="mb-4">
            <span className="text-4xl md:text-6xl lg:text-8xl font-bold">Not everyone has</span>
          
          </div>
          <div className="mb-4">
            <span className="text-4xl md:text-6xl lg:text-8xl font-bold">aura. But you do.</span>
            
          </div>
          <div className="flex flex-col mb-4 text-2xl ">
            <p>Claim your aura and</p>
            <p> see how your friends compare.</p>
          </div>
          
          <Button
            onClick={toSignUpClick}
            label="Claim"
            className="text-white font-semibold bg-gradient-custom text-sm flex items-center justify-center px-3 py-1.5 rounded-2xl hover:cursor-pointer hover:text-black w-full sm:w-auto mt-4"
          />
        </div>

        <div className="px-4 py-8 flex justify-center items-end"  style={{
        backgroundImage: `url(${welcomePagePicture})`,
        backgroundSize: 'cover', 
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top', 
        height: '65vh', 
        width: '100%',
      }}>
        <div>
        <div className="flex justify-center mb-4">
            <span className="text-3xl md:text-5xl lg:text-7xl font-bold">How It Works</span>
          </div>
          
          <div className="flex justify-center">
            <p className="w-full md:w-[55%] lg:w-[44%] text-center text-base md:text-lg lg:text-xl ">
              After registering, you will receive your
              <span className="inline-flex items-center align-middle mb-1">
                <img src={auraSymbol} alt="Aura Symbol" className="h-5 md:h-7 mx-1 align-middle" />
                aura.
              </span>
              See how your friends compare and judge their aura
              <span className="text-custom-purple"> instantly</span>.
            </p>
          </div>

          <Button 
            label={"Claim Your Aura"}
            className="text-white font-semibold bg-black text-sm flex items-center justify-center px-3 py-1.5 rounded-2xl hover:cursor-pointer hover:bg-gray-700 w-full sm:w-auto mt-4 mx-auto"
          />
        </div>
        </div>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default WelcomePage;