import { Nav } from './Nav';
import { Route, Routes } from 'react-router-dom';
import { Login } from './components/Login';
import { UserLayout } from './components/UserLayout';
import { Users } from './components/Users';
import { UserDetail } from './components/UserDetail';
import { AlbumLayout } from './components/AlbumLayout';
import { Albums } from './components/Albums';
import { AlbumDetail } from './components/AlbumDetail';

function App() {
  return (
    <>
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
    </>
  );
}

export default App;
