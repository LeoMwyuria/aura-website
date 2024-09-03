import { useNavigate } from 'react-router-dom';
import AuraNet from '../../assets/AuraNet.png';

const LogInHeader = () => {
  const navigate = useNavigate();

  const toSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b border-gray-300">
      <div className="flex items-center">
        <img
          src={AuraNet}
          alt="Website Logo"
          className="h-10 cursor-pointer"
          onClick={() => navigate('/')}
        />
      </div>
      <div className="flex items-center   w-[18%]">
        <span className='font-bold text-sm'>Not a member yet?</span>
        <a
          onClick={toSignUpClick}
          className=" no-select mx-auto text-white font-semibold bg-black text-sm flex items-center pl-3 pr-3 rounded-2xl hover:cursor-pointer hover:bg-gray-700 w-[35%] justify-center p-2"
        >
          Sign Up
        </a>
      </div>
    </header>
  );
};

export default LogInHeader;
