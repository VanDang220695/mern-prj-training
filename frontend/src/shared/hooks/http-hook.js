import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequest = useRef([]);

  const sendRequest = useCallback(async (url, { method = 'GET', body = null, headers = {} }) => {
    try {
      setIsLoading(true);
      const httpAbortController = new AbortController();
      activeHttpRequest.current.push(httpAbortController);
      activeHttpRequest.current.filter(
        (abortController) => abortController !== httpAbortController,
      );
      const response = await fetch(url, {
        method,
        body,
        headers,
        signal: httpAbortController.signal,
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      setIsLoading(false);
      return responseData;
    } catch (error) {
      await setError(error.message);
      setIsLoading(false);
      throw error;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      activeHttpRequest.current.forEach((abortController) => abortController.abort());
    };
  }, []);

  return {
    isLoading,
    error,
    sendRequest,
    clearError,
  };
};
