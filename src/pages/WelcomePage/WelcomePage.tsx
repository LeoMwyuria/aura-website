import { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import welcomePagePicture from '../../assets/welcomePagePicture.png';
import auraSymbol from '../../assets/auraSymbol.png';
import Button from '../../components/Button/Button'; 
import welcomePagePicture2 from '../../assets/welcomePagePicture2.png';
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import ScrollToTopButton from "../../components/ScrollToTop/ScrollToTop";
import StarAnimation from "../../components/StarAnimation/StarAnimation";

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
      <Header />
      <main className={`flex-grow ${isVisible ? 'fade-in' : 'opacity-0'}`}>
        <div className="h-[40%] flex flex-col justify-center items-center text-center mt-5">
          <div>
            <span className="text-8xl font-bold">Your aura</span>
            <span className="text-8xl font-bold text-custom-dot">.</span>
          </div>
          <div>
            <span className="text-8xl font-bold">in your hands</span>
            <span className="text-8xl font-bold text-custom-dot">.</span>
          </div>
          <div className="flex flex-col">
            <p className="font-bold">Claim your aura and</p>
            <p className="font-bold">compare it with friends</p>
          </div>
          
          <Button 
          onClick={toSignUpClick}
            label="Claim"
            className="text-white font-semibold bg-gradient-custom text-sm flex items-center justify-center pl-3 pr-3 rounded-2xl hover:cursor-pointer hover:text-black w-[7%] p-1.5 mx-auto mt-4"
          />
        </div>
        
        <div className="flex justify-center">
          <img className="w-[70%]" src={welcomePagePicture} alt="" />
        </div>
        
        <div>
          <div className="flex justify-center">
            <span className="text-7xl font-bold mb-4">How It Works</span>
          </div>
          
          <div className="flex justify-center">
            <p className="w-[29%] text-center">
              After registering, you will receive your
              <span className="inline-flex items-center align-middle mb-1">
                <img src={auraSymbol} alt="Aura Symbol" className="h-6 mx-1 align-middle" />
                aura.
              </span> 
              See how your friends compare and judge their aura
              <span className="text-custom-purple"> instantly</span>.
            </p>
          </div>
          <Button label={"Claim Your Aura"} className="text-white font-semibold bg-black text-sm flex items-center justify-center pl-3 pr-3 rounded-2xl hover:cursor-pointer hover:bg-gray-700 w-[7%] p-1.5 mx-auto mt-4"/>
        </div>
        <div className="flex justify-center flex-col items-center h-full">
          <img className="h-[90%]" src={welcomePagePicture2} alt="" />
          <span className="flex justify-center text-5xl relative bottom-20">What are you waiting for?</span>
          <a onClick={toSignUpClick} className="mx-auto text-white font-semibold bg-black text-sm flex items-center pl-3 pr-3 rounded-2xl hover:cursor-pointer hover:bg-gray-700 w-[7%] justify-center p-2 relative bottom-9">Sign Up</a>
        </div>
      </main>
      <Footer />
      <ScrollToTopButton /> 
    </div>
  );
};

export default WelcomePage;
