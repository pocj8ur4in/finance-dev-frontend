/* eslint-disable react-refresh/only-export-components */

import { useContext, createContext } from 'react';
import { LoginUser } from '../components/Login';

export type Session = {
  loginUser: LoginUser | null;
};

type SessionContextProp = {
  session: Session;
  login: (id: string) => boolean;
  logout: () => void;
};

const SessionContext = createContext<SessionContextProp>({
  session: { loginUser: null },
  login: () => false,
  logout: () => {},
});

export const useSession = () => useContext(SessionContext);
