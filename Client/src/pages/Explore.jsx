import { useState } from "react";
import { useFetch, useTitle } from "@hooks";
import { pinService } from "@services";
import { PageLayout } from "@layouts";
import { Spinner } from "@utils";
import { ReactInfiniteScroll, MasonryLayout, PinCard } from "@components";

export default function Explore() {
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [moreData, setMoreData] = useState([]);
  const {
    data,
    loading,
    error: errorFetch,
  } = useFetch(pinService.getRandomPins, currentPage);
  useTitle("Explore random pins");
  console.log("pg", data);

  const firstData = Array.isArray(data?.pins) ? data.pins : [];
  console.log("ft", firstData);

  const fetchMoreData = async () => {
    if (firstData?.length < 20) {
      setHasMore(false);
      return;
    }
    try {
      setMoreData((prevMoreData) => [...prevMoreData, ...firstData]);
      setHasMore(moreData.length > 0);
      setCurrentPage((prevPage) => prevPage + 1);
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

  const allPins = [...moreData, ...firstData];

  return (
    <PageLayout>
      {errorFetch || error ? (
        <>
          <p>{errorFetch || error}</p>
        </>
      ) : (
        <>
          {loading && <Spinner text="Fetching pins" />}
          {allPins?.length > 0 ? (
            <ReactInfiniteScroll
              dataLength={allPins?.length}
              fetchData={fetchMoreData}
              hasMore={hasMore}
            >
              <MasonryLayout>
                {allPins.map((pin, index) => (
                  <PinCard key={index} {...pin} />
                ))}
              </MasonryLayout>
            </ReactInfiniteScroll>
          ) : (
            <p>No pins to show at the moment.</p>
          )}
        </>
      )}
    </PageLayout>
  );
}
