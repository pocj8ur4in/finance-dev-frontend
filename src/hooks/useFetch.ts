import { useEffect, useState } from 'react';

// FetchParam 타입 정의
type FetchParam<T> = {
  url: string | URL | globalThis.Request; // 데이터를 가져올 URL 또는 Request 객체
  options?: RequestInit; // fetch 요청 시 사용할 옵션들
  dependencies?: unknown[]; // useEffect 의존성 배열
  defaultData?: T; // 초기 데이터 값
  enable?: boolean; // 비동기 요청 활성화 여부
};

// useFetch 커스텀 훅 정의
export const useFetch = <T>({
  url,
  options = {},
  dependencies = [],
  defaultData,
  enable = true,
}: FetchParam<T>) => {
  const [isLoading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(''); // 에러 상태
  const [data, setData] = useState<T | undefined>(defaultData); // 가져온 데이터

  // useEffect 훅을 통헤 비동기 통신 및 상태 업데이트 수행
  useEffect(() => {
    const abortController = new AbortController(); // AbortController으로 비동기 통신을 취소할 수 있는 기능 추가
    options.signal = abortController.signal;

    // enable이 false일 경우, 통신을 수행하지 않고 종료
    if (!enable) return;

    // 비동기 함수 정의
    (async function () {
      // 로딩 상태 및 에러 초기화
      setLoading(true);
      setError('');

      try {
        // fetch를 통해 데이터 요청
        const result = await fetch(url, options);

        // HTTP 응답이 실패하면, 에러로 처리
        if (!result.ok) {
          setError(result.status.toString());
          return;
        }

        const data = (await result.json()) as T; // JSON 데이터로 변환 후 상태 업데이트
        setData(data);
      } catch (error) {
        // 에러 처리
        if (error instanceof Error)
          if (error.name !== 'AbortError') setError(error.message); // AbortError가 아니면 메시지 업데이트
      } finally {
        // 로딩 상태 종료
        setLoading(false);
      }
    })();

    return () => abortController.abort(); // 컴포넌트 언마운트 시 abortController.abort()로 중단
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, isLoading, error };
};
