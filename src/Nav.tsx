import { useSession } from '@/contexts/session-context';
import { useNavigate } from 'react-router-dom';
import { LoginFetch } from '@/components/LoginFetch';

export const Nav = () => {
  const navigate = useNavigate();

  const {
    session: { loginId: loginId, loginUser: loginUser },
    logout,
  } = useSession();

  return (
    <nav className='bg-green-600 p-4 rounded-lg mb-4 flex justify-between items-center'>
      <div className='flex items-center space-x-4 text-white'>
        <span className='text-3xl font-extrabold'>Hanaro Album</span>
      </div>
      {loginId && (
        <div className='flex items-center space-x-4 text-white ml-auto'>
          <div className='flex flex-col'>
            {loginUser &&
              (loginUser.id === 0 ? (
                <LoginFetch />
              ) : (
                <>
                  {loginUser?.id} {loginUser?.name}
                </>
              ))}
          </div>
          <button
            className='bg-green-700 text-white px-4 py-2 rounded-full hover:bg-green-800 focus:outline-none'
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            로그아웃
          </button>
        </div>
      )}
    </nav>
  );
};
