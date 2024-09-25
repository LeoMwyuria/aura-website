import { useNavigate } from 'react-router-dom';
import AuraNet from '../../assets/AuraNet.png';

const SignUpHeader = () => {
  const navigate = useNavigate();

  const toLoginClick = () => {
    navigate('/login');
  };

  return (
    <header className="flex flex-col sm:flex-row items-center justify-between p-2 sm:p-4 bg-white border-b border-gray-300">
      <div className="flex items-center mb-4 sm:mb-0">
        <img
          src={AuraNet}
          alt="Website Logo"
          className="h-8 sm:h-10 cursor-pointer"
          onClick={() => navigate('/')}
        />
      </div>
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
        <span className='font-bold text-xs sm:text-sm'>Already have an account?</span>
        <a
          onClick={toLoginClick}
          className="no-select text-white font-semibold bg-black text-xs sm:text-sm flex items-center justify-center px-3 py-2 rounded-2xl hover:cursor-pointer hover:bg-gray-700 w-full sm:w-auto"
        >
          Log In
        </a>
      </div>
    </header>
  );
};

export default SignUpHeader;