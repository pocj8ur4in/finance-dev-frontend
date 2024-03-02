import { useRef } from 'react';
import { Nav } from './Nav';
import { Route, Routes } from 'react-router-dom';
import { Login, LoginHandler } from './components/Login';
import { Album } from './components/Album';
import { Photo } from './components/Photo';
import { SessionProvider } from './contexts/session-context';

function App() {
  const loginHandlerRef = useRef<LoginHandler>(null);

  return (
    <>
      <SessionProvider loginHandlerRef={loginHandlerRef}>
        <Nav />
        <Routes>
          <Route path='/' element={<Login />}></Route>
          <Route path='/albums' element={<Album />}></Route>
          <Route path='albums/photos' element={<Photo />}></Route>
        </Routes>
      </SessionProvider>
    </>
  );
}

export default App;
