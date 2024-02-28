import { useReducer } from 'react';

// useToggle 커스텀 훅 정의
export const useToggle = (defaultFlag: boolean = false) => {
  const [flag, makeToggle] = useReducer((previous) => !previous, defaultFlag); // useReducer로 상태와 토글 함수 생성

  return [flag, makeToggle] as const; // 토글된 상태와 토글 함수를 튜플로 반환
};
