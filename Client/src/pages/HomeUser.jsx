import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useFetch, useTitle } from "@hooks";
import { pinService } from "@services";
import { PageLayout } from "@layouts";
import { Spinner } from "@utils";
import { ReactInfiniteScroll, MasonryLayout, PinCard } from "@components";

export default function HomeUser() {
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [moreData, setMoreData] = useState([]);
  const {
    data,
    loading,
    error: errorFetch,
  } = useFetch(pinService.getFollowedPins, currentPage);
  useTitle("Your Home pins");
  uuidv4();

  const fetchMoreData = async () => {
    try {
      setMoreData((prevMoreData) => [...prevMoreData, ...data]);
      moreData?.length > 0 ? setHasMore(true) : setHasMore(false);
      setCurrentPage((prevPage) => prevPage + 1);
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

  const allPins = [...moreData, ...data];

  return (
    <PageLayout>
      {errorFetch || error ? (
        <>
          <p>{errorFetch || error} </p>
        </>
      ) : (
        <>
          {loading && <Spinner text="Fetching pins" />}
          {allPins?.length > 0 && (
            <ReactInfiniteScroll
              dataLength={allPins?.length}
              fetchData={fetchMoreData}
              hasMore={hasMore}
            >
              <MasonryLayout>
                {allPins.map((pin) => (
                  <PinCard key={uuidv4()} {...pin} />
                ))}
              </MasonryLayout>
            </ReactInfiniteScroll>
          )}
          {!allPins.length && (
            <p className="mt-5">
              No pins to show at the moment. Vist explore to view and follow a
              user
            </p>
          )}
        </>
      )}
    </PageLayout>
  );
}
