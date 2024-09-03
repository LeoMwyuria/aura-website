import { useNavigate } from 'react-router-dom';
import AuraNet from '../../assets/AuraNet.png';

const SignUpHeader = () => {
  const navigate = useNavigate();

  const toLoginClick = () => {
    navigate('/login');
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
      <div className="flex w-[20%] items-center">
        <span className='font-bold text-sm'>Already have an account?</span>
        <a
          onClick={toLoginClick}
          className=" no-select mx-auto text-white font-semibold bg-black text-sm flex items-center pl-3 pr-3 rounded-2xl hover:cursor-pointer hover:bg-gray-700 w-[35%] justify-center p-2"
        >
          Log In
        </a>
      </div>
    </header>
  );
};

export default SignUpHeader;
