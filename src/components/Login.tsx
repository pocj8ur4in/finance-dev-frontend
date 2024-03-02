import { ForwardedRef, forwardRef, useRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/session-context';

// 로그인 시 필요한 사용자 정보
export type LoginUser = {
  id: number;
  name: string;
};

// 외부에서 로그인 컴포넌트 호출할 메서드 정의
export type LoginHandler = {
  loginMessage: (message: string) => void;

  // 사용자 ID 입력란에 포커스
  focusUserIdInput: () => void;
};

// Login 컴포넌트 정의
export const Login = forwardRef((_, ref: ForwardedRef<LoginHandler>) => {
  // 사용자 ID 입력란을 참조
  const idRef = useRef<HTMLInputElement | null>(null);
  // 세션 관련 기능을 담은 useSession 사용
  const { login } = useSession();
  // 페이지 이동을 담당할 useNavigate 사용
  const navigate = useNavigate();

  // 외부에서 호출 가능한 메서드를 정의
  const loginHandler = {
    loginMessage: (message: string) => alert(message),

    // 사용자 ID 입력란에 포커스
    focusUserIdInput: () => idRef.current?.focus(),
  };

  // 부모 컴포넌트에서 참조할 때 사용할 메서드 노출
  useImperativeHandle(ref, () => loginHandler);

  // 로그인 버튼 클릭 시 수행
  const doLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = idRef.current?.value;

    try {
      if (!idRef.current || !id) {
        alert('ID를 입력하세요.');
        idRef.current?.focus();
        return;
      }

      if (Number(id) < 0 || Number(id) > 10) {
        alert('유효한 ID가 아닙니다.');
        idRef.current?.focus();
        return;
      }

      // 앨범 페이지 이동
      if (login(id)) navigate('/albums');
    } catch (error) {
      console.log(error);
      alert('로그인에 실패했습니다.');
    }
  };

  // 사용자 ID 입력란과 로그인 버튼을 포함한 폼 렌더링
  return (
    <>
      <form className='max-w-sm mx-auto mt-8' onSubmit={doLogin}>
        <input
          type='text'
          ref={idRef}
          className='w-full p-2 mb-4 border border-gray-300 rounded'
          placeholder='Enter your ID'
        />
        <button
          type='submit'
          className='w-full bg-green-600 text-white p-2 rounded cursor-pointer'
        >
          Sign-in
        </button>
      </form>
    </>
  );
});

Login.displayName = 'Login';
