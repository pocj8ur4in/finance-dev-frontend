import { ForwardedRef, forwardRef, useRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/session-context';

export type LoginUser = { id: string }; // 로그인 시 필요한 사용자 정보

// 외부에서 로그인 컴포넌트 호출할 메서드 정의
export type LoginHandler = {
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
  const handler = {
    // 사용자 ID 입력란에 포커스
    focusUserIdInput: () => idRef.current?.focus(),
  };

  // 부모 컴포넌트에서 참조할 때 사용할 메서드 노출
  useImperativeHandle(ref, () => handler);

  // 로그인 버튼 클릭 시 수행
  const doLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const id = idRef.current?.value;

    // 유효성 검사
    if (!(id && Number(id) <= 10 && Number(id) > 0)) {
      // 유효하지 않은 범위의 ID일 경우 경고 알림
      alert('유효하지 않은 ID 범위입니다.');
      return;
    }

    // 세션에 로그인 및 사용자 페이지 이동
    if (login(id ?? '')) navigate('/users/' + id);
  };

  // 사용자 ID 입력란과 로그인 버튼을 포함한 폼 렌더링
  return (
    <>
      <form onSubmit={doLogin}>
        <input type='text' ref={idRef} />
        <button type='submit'>Sign-in</button>
      </form>
    </>
  );
});

Login.displayName = 'Login';
