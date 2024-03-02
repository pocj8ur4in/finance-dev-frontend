/* eslint-disable react-refresh/only-export-components */

import {
  ReactNode,
  RefObject,
  useContext,
  createContext,
  useCallback,
  useReducer,
  useEffect,
} from 'react';
import { LoginHandler, LoginUser } from '@/components/Login';
import { AlbumType } from '@/components/Album';

export type Session = {
  loginId: string | null;
  loginUser: LoginUser | null;
  album: AlbumType | null;
};

type SessionContextProp = {
  session: Session;
  login: (loginId: string) => boolean;
  logout: () => void;
  updateUser: ({ id, name }: LoginUser) => void;
  updateAlbum: (album: AlbumType) => void;
};

type ProviderProps = {
  children: ReactNode;
  loginHandlerRef?: RefObject<LoginHandler>;
};

// 세션의 초기 상태 정의
const InitSession: Session = {
  loginId: null,
  loginUser: {
    id: 0,
    name: '',
  },
  album: {
    userId: 0,
    id: 0,
    title: '',
  },
};

// 세션 컨텍스트에서 사용될 액션 타입 정의
type Action =
  | {
      type: 'login';
      payload: string | null;
    }
  | { type: 'logout'; payload: null }
  | { type: 'set'; payload: Session }
  | { type: 'updateUser'; payload: LoginUser }
  | { type: 'updateAlbum'; payload: AlbumType };

// 로컬 스토리지에 세션 정보 가져옴
function getStorage() {
  const storedData = localStorage.getItem('session');
  if (storedData) {
    return JSON.parse(storedData) as Session;
  }

  setStorage(InitSession);

  return InitSession;
}

// 로컬 스토리지에 세션 정보 설정
function setStorage(session: Session) {
  localStorage.setItem('session', JSON.stringify(session));
}

// 로컬 스토리지에 세션 정보 초기화
function resetStorage() {
  localStorage.clear();
  setStorage(InitSession);

  return InitSession;
}

// 세션 관리를 위한 세션 컨텍스트 생성
const SessionContext = createContext<SessionContextProp>({
  session: {
    loginId: '',
    loginUser: { id: 0, name: '' },
    album: { userId: 0, id: 0, title: '' },
  },
  login: () => false,
  logout: () => {},
  updateUser: () => {},
  updateAlbum: () => {},
});

// 세션 컨텍스트를 설정할 컴포넌트
const sessionReducer = (session: Session, { type, payload }: Action) => {
  let newer;
  switch (type) {
    case 'set':
      newer = { ...payload };
      break;

    case 'login':
      newer = { ...session, loginId: payload };
      break;
    case 'logout':
      newer = { ...session };
      break;
    case 'updateUser':
      newer = { ...session, loginUser: payload };
      break;
    case 'updateAlbum':
      newer = { ...session, album: payload };
      break;
    default:
      return session;
  }
  setStorage(newer);
  return newer;
};

// 세션 컨텍스트를 제공할 컴포넌트
export const SessionProvider = ({ children }: ProviderProps) => {
  const [session, dispatch] = useReducer(sessionReducer, InitSession);

  // 로그인
  const login = useCallback((id: string) => {
    dispatch({ type: 'login', payload: id });
    return true;
  }, []);

  // 회원 정보 갱신
  const updateUser = useCallback((loginUser: LoginUser) => {
    dispatch({ type: 'updateUser', payload: loginUser });
    return true;
  }, []);

  // 앨범 정보 갱신
  const updateAlbum = useCallback((album: AlbumType) => {
    dispatch({ type: 'updateAlbum', payload: album });
    return true;
  }, []);

  // 로그아웃
  const logout = useCallback(() => {
    dispatch({ type: 'set', payload: resetStorage() });
  }, []);

  useEffect(() => {
    dispatch({ type: 'set', payload: getStorage() });
  }, []);

  return (
    <SessionContext.Provider
      value={{ session, login, logout, updateUser, updateAlbum }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
