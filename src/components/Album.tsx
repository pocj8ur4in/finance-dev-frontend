import { useState, useEffect } from 'react';
import { useSession } from '@/contexts/session-context';
import { useFetch } from '@/hooks/useFetch';
import { useNavigate } from 'react-router-dom';

export type AlbumType = {
  userId: number;
  id: number;
  title: string;
};

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const Album = () => {
  const [album, setAlbum] = useState<AlbumType[] | null>(null);
  const [currentAlbum, setCurrentAlbum] = useState<AlbumType | null>(null);
  const navigate = useNavigate();

  const {
    session: { album: albums, loginId: loginId },
    updateAlbum,
  } = useSession();

  const { data, error } = useFetch<AlbumType[]>({
    url: `${BASE_URL}/albums?userId=${loginId}`,
    dependencies: [loginId],
    defaultData: [],
    enable: !!loginId,
  });

  const handleButtonClick = (selectedAlbum: AlbumType) => {
    if (currentAlbum === selectedAlbum) {
      setCurrentAlbum(null);
    } else {
      setCurrentAlbum(selectedAlbum);
    }
  };

  useEffect(() => {
    if (data) {
      setAlbum(data);

      if (!currentAlbum && albums !== null) {
        setCurrentAlbum(data[(albums.id % 10) - 1]);
      }

      return;
    }
  }, [albums, currentAlbum, data]);

  if (error) {
    return <h1>{error}</h1>;
  }

  // if (isLoading) return <h1>Loading...</h1>;

  return (
    <>
      <div className='relative'>
        <div className='flex justify-between space-x-4'>
          <ul className='space-y-2'>
            {album?.map((albumItem) => (
              <li key={albumItem.id}>
                <button
                  className={`hover:text-blue-300 focus:outline-none ${currentAlbum === albumItem ? 'bg-blue-500 text-white' : 'text-blue-500'}`}
                  onClick={() => handleButtonClick(albumItem)}
                >
                  {albumItem.id}. {albumItem.title}
                </button>
              </li>
            ))}
          </ul>
          {currentAlbum && (
            <div className='absolute top-0 right-0 flex flex-col justify-center'>
              <button
                className='bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 focus:outline-none'
                onClick={() => {
                  updateAlbum(currentAlbum);
                  navigate('/albums/photos');
                }}
              >
                상세보기
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
