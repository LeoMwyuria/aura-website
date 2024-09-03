import logo_white from '../../assets/logo_white.png';

const Footer = () => {
  return (
    <footer className="flex items-center justify-between p-6 bg-black border-t border-gray-300 mt-auto">
      <div className="flex items-center">
        <img src={logo_white} alt="Website Logo" className="h-8 mr-4" />
        <div className="text-white text-base">
          <p>© 2024 AuraNet. This is not a real website.</p>
        </div>
      </div>
      <div className="text-white text-sm w-[20%] text-right">
        <p>AuraNet is not responsible for any damage done to your body due to the excessive amount of aura that you may absorb during your visit here.</p>
      </div>
    </footer>
  );
};

export default Footer;
