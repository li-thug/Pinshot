import { useEffect, useState, useMemo } from "react";

export default function useFetch(api, params, extra) {
  const [getData, setGetData] = useState([]);
  const [pageData, setPageData] = useState([]);
  const [loading, setLoading] = useState([]);
  const [error, setError] = useState(null);

  const data = useMemo(() => getData, [getData]);
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api(params, extra, { signal });
        if (!signal.aborted) {
          setGetData(res.data);
          setPageData(res.data?.pins);
          setError(null);
        }
      } catch (error) {
        if (!signal.aborted) {
          setError(error?.response?.data || error?.message);
        }
        console.error(error);
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      controller.abort();
    };
  }, [api, params, extra]);
  return { data, loading, error, setGetData, pageData, setLoading };
}
