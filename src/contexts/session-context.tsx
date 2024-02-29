/* eslint-disable react-hooks/exhaustive-deps */
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
import { LoginUser, LoginHandler } from '../components/Login';

export type Session = {
  loginUser: LoginUser | null;
};

type SessionContextProp = {
  session: Session;
  login: (id: string) => boolean;
  logout: () => void;
};

type ProviderProps = {
  children: ReactNode;
  loginHandlerRef?: RefObject<LoginHandler>;
};

// 세션의 초기 상태 정의
const InitSession: Session = {
  loginUser: null,
};

// 세션 컨텍스트에서 사용될 액션 타입 정의
type Action =
  | {
      type: 'login' | 'logout';
      payload: LoginUser | null;
    }
  | { type: 'set'; payload: Session };

const SessionKey = 'session';

// 로컬 스토리지에 세션 정보 가져옴
function getStorage() {
  const storedData = localStorage.getItem(SessionKey);
  if (storedData) {
    return JSON.parse(storedData) as Session;
  }

  setStorage(InitSession);

  return InitSession;
}

// 로컬 스토리지에 세션 정보 설정
function setStorage(session: Session) {
  localStorage.setItem(SessionKey, JSON.stringify(session));
}

// 세션 관리를 위한 세션 컨텍스트 생성
const SessionContext = createContext<SessionContextProp>({
  session: { loginUser: null },
  login: () => false,
  logout: () => {},
});

// 세션 컨텍스트를 설정할 컴포넌트
const sessionReducer = (session: Session, { type, payload }: Action) => {
  let newer;
  switch (type) {
    case 'set':
      newer = { ...payload };
      break;

    case 'login':
    case 'logout':
      newer = { ...session, loginUser: payload };
      break;
    default:
      return session;
  }
  setStorage(newer);
  return newer;
};

// 세션 컨텍스트를 제공할 컴포넌트
export const SessionProvider = ({
  children,
  loginHandlerRef,
}: ProviderProps) => {
  const [session, dispatch] = useReducer(sessionReducer, InitSession);

  // 로그인
  const login = useCallback((id: string) => {
    const loginMessage = loginHandlerRef?.current?.loginMessage || alert;
    const focusUserIdInput = loginHandlerRef?.current?.focusUserIdInput;

    if (!Number(id) || isNaN(Number(id))) {
      loginMessage('ID를 입력하세요.');
      if (focusUserIdInput) focusUserIdInput();
      return false;
    }

    if (Number(id) < 0 || Number(id) > 10) {
      loginMessage('유효한 범위를 벗어났습니다.');
      if (focusUserIdInput) focusUserIdInput();
      return false;
    }

    dispatch({ type: 'login', payload: { id } });
    return true;
  }, []);

  // 로그아웃
  const logout = useCallback(() => {
    dispatch({ type: 'logout', payload: null });
  }, []);

  useEffect(() => {
    dispatch({ type: 'set', payload: getStorage() });
  }, []);

  return (
    <SessionContext.Provider value={{ session, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
