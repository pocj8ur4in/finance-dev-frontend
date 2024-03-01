import { useState, useEffect } from 'react';
import { useSession } from '@/contexts/session-context';
import { useFetch } from '@/hooks/useFetch';
import { Outlet, useNavigate } from 'react-router-dom';

export type AlbumType = {
  userId: number;
  id: number;
  title: string;
};

type Props = {
  // albumId?: number;
  albumData?: AlbumType;
};

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const Album = ({ albumData }: Props) => {
  const [album, setAlbum] = useState<AlbumType | null>(null);
  const [currentAlbum, setCurrentAlbum] = useState<AlbumType | null>(null);

  const {
    session: { loginUser },
  } = useSession();

  const { data, error, isLoading } = useFetch<AlbumType[]>({
    url: `${BASE_URL}/albums?userId=${loginUser?.id}`,
    dependencies: [loginUser],
    defaultData: [],
    enable: !!loginUser?.id,
  });

  useEffect(() => {
    if (albumData) {
      setAlbum(albumData);
      return;
    }

    if (data) {
      return;
    }
  }, [data, albumData]);

  if (error) {
    return <h1>{error}</h1>;
  }

  const goAlbum = (album: AlbumType) => {
    setCurrentAlbum(album);
  };

  return (
    <>
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <div className='flex'>
          <ul>
            {data?.map((album) => (
              <li key={album.id}>
                <button
                  onClick={() => goAlbum(album)}
                  className='hover:text-blue-300'
                >
                  {album.id}. {album.title}
                </button>
              </li>
            ))}
          </ul>
          <div>
            <Outlet context={{ album: currentAlbum }} />
          </div>
        </div>
      )}
    </>
  );
};
