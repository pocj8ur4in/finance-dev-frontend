import { useState, useEffect } from 'react';
import { useSession } from '@/contexts/session-context';
import { LoginUser } from '@/components/Login';
import { useFetch } from '@/hooks/useFetch';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const LoginFetch = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [user, setUser] = useState<LoginUser | null>(null);

  const {
    session: { loginId: loginId, loginUser: loginUser },
    updateUser,
  } = useSession();

  const { data, error } = useFetch<LoginUser>({
    url: `${BASE_URL}/users/${loginId}`,
    dependencies: [loginId],
    enable: !!loginId,
  });

  useEffect(() => {
    if (data) {
      setUser(data);
      updateUser(data);
      return;
    }
  }, [data, updateUser]);

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <>
      <p className='text-white'>
        {loginId} {loginUser?.name}
      </p>
    </>
  );
};
