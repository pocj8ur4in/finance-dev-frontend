import { useState, useEffect, useMemo } from 'react';
import { useSession } from '@/contexts/session-context';
import { useFetch } from '@/hooks/useFetch';
import { useNavigate } from 'react-router-dom';

export type PhotoType = {
  userId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
};

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const Photo = () => {
  const [photo, setPhoto] = useState<PhotoType[] | null>(null);

  const navigate = useNavigate();

  const {
    session: { album },
  } = useSession();

  const { data, error } = useFetch<PhotoType[]>({
    url: `${BASE_URL}/photos?albumId=${album?.id}`,
    dependencies: [album?.id],
    defaultData: [],
    enable: !!album?.id,
  });

  useEffect(() => {
    if (data) {
      setPhoto(data);
      return;
    }
  }, [data]);

  if (error) {
    return <h1>{error}</h1>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const memoizedPhoto = useMemo(() => photo, [photo]);

  // if (isLoading) return <h1>Loading...</h1>;

  return (
    <>
      <div className='flex flex-col'>
        <div className='flex justify-between mb-4'>
          <div>
            <h2 className='text-2xl font-bold mb-4'>{album?.title}</h2>
          </div>
          <div>
            <button
              className='bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 focus:outline-none'
              onClick={() => {
                navigate('/albums');
              }}
            >
              뒤로가기
            </button>
          </div>
        </div>

        <div className='grid grid-cols-4 gap-4'>
          {memoizedPhoto?.map((photoItem) => (
            <div key={photoItem.id} className='text-center'>
              <img
                src={photoItem.thumbnailUrl}
                alt={`Thumbnail for ${photoItem.title}`}
                className='w-full h-auto rounded mb-2'
              />
              <p className='text-sm text-gray-800'>{photoItem.title}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
