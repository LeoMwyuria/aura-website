import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import welcomePagePicture from '../../assets/welcomePagePicture.png';
import auraSymbol from '../../assets/auraSymbol.png';
import welcomePagePicture2 from '../../assets/welcomePagePicture2.png';
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
            <span className="text-4xl md:text-6xl lg:text-8xl font-bold">Your aura</span>
            <span className="text-4xl md:text-6xl lg:text-8xl font-bold text-custom-dot">.</span>
          </div>
          <div className="mb-4">
            <span className="text-4xl md:text-6xl lg:text-8xl font-bold">in your hands</span>
            <span className="text-4xl md:text-6xl lg:text-8xl font-bold text-custom-dot">.</span>
          </div>
          <div className="flex flex-col mb-4">
            <p className="font-bold text-sm md:text-base">Claim your aura and</p>
            <p className="font-bold text-sm md:text-base">compare it with friends</p>
          </div>
          
          <Button
            onClick={toSignUpClick}
            label="Claim"
            className="text-white font-semibold bg-gradient-custom text-sm flex items-center justify-center px-3 py-1.5 rounded-2xl hover:cursor-pointer hover:text-black w-full sm:w-auto mt-4"
          />
        </div>
        
        <div className="flex justify-center px-4 my-8">
          <img className="w-full md:w-[70%]" src={welcomePagePicture} alt="Welcome" />
        </div>
        
        <div className="px-4 my-8">
          <div className="flex justify-center mb-4">
            <span className="text-3xl md:text-5xl lg:text-7xl font-bold">How It Works</span>
          </div>
          
          <div className="flex justify-center">
            <p className="w-full md:w-[60%] lg:w-[29%] text-center text-sm md:text-base">
              After registering, you will receive your
              <span className="inline-flex items-center align-middle mb-1">
                <img src={auraSymbol} alt="Aura Symbol" className="h-4 md:h-6 mx-1 align-middle" />
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
        <div className="flex justify-center flex-col items-center h-full px-4 my-8">
          <img className="w-full md:h-[90%]" src={welcomePagePicture2} alt="Welcome 2" />
          <span className="flex justify-center text-2xl md:text-4xl lg:text-5xl text-center mt-4 md:relative md:bottom-20">What are you waiting for?</span>
          <a onClick={toSignUpClick} className="mx-auto text-white font-semibold bg-black text-sm flex items-center px-3 py-2 rounded-2xl hover:cursor-pointer hover:bg-gray-700 w-full sm:w-auto justify-center mt-4 md:relative md:bottom-9">Sign Up</a>
        </div>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default WelcomePage;