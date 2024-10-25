import logo_white from '../../assets/GlamouraFooter.png';

const Footer = () => {
  return (
    <footer className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 bg-black border-t border-gray-300 mt-auto">
      <div className="flex items-center mb-4 sm:mb-0">
        <img src={logo_white} alt="Website Logo" className="h-6 sm:h-8 mr-4" />
        <div className="text-white text-sm sm:text-base">
          <p>© 2024 Glamoura. All rights reserved.</p>
        </div>
      </div>
      <div className="text-white text-xs sm:text-sm w-full sm:w-[20%] text-center sm:text-right">
        <p>Glamoura is not responsible for any damage done to your body due to the excessive amount of aura that you may absorb during your visit here.</p>
      </div>
    </footer>
  );
};

export default Footer;
