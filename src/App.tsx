import { useRef } from 'react';
import { Nav } from './Nav';
import { Route, Routes } from 'react-router-dom';
import { Login, LoginHandler } from './components/Login';
import { UserLayout } from './components/user/UserLayout';
import { Users } from './components/user/Users';
import { UserDetail } from './components/user/UserDetail';
import { AlbumLayout } from './components/album/AlbumLayout';
import { Albums } from './components/album/Albums';
import { AlbumDetail } from './components/album/AlbumDetail';
import { SessionProvider } from './contexts/session-context';

function App() {
  const loginHandlerRef = useRef<LoginHandler>(null);

  return (
    <>
      <SessionProvider loginHandlerRef={loginHandlerRef}>
        <Nav />
        <Routes>
          <Route path='/' element={<Login />}></Route>
          <Route path='/users/*' element={<UserLayout />}>
            <Route index element={<Users />} />
            <Route path=':userId/*' element={<UserDetail />} />
            <Route path=':userId/albums/*' element={<AlbumLayout />}>
              <Route index element={<Albums />} />
              <Route path=':userId/albums/:albumId' element={<AlbumDetail />} />
            </Route>
          </Route>
        </Routes>
      </SessionProvider>
    </>
  );
}

export default App;
