import PropTypes from "prop-types";
import { useFetch } from "@hooks";
import { pinService } from "@services";
import { Spinner } from "@utils";
import { PinCard, MasonryLayout } from "@components";

export default function UserLikedPins({ userId }) {
  const { data, error, loading } = useFetch(
    pinService.getPinsLikedByUser,
    userId
  );
  return (
    <div className="mt-5">
      {error ? (
        <p className="mt-5">{error}</p>
      ) : (
        <>
          {loading ? (
            <Spinner text="Fetching liked pins..." />
          ) : (
            <>
              {data?.length > 0 ? (
                <MasonryLayout>
                  {data?.map((pin) => (
                    <PinCard key={pin._id} {...pin} />
                  ))}
                </MasonryLayout>
              ) : (
                <p>No liked pins yet.</p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

UserLikedPins.propTypes = {
    userId: PropTypes.string,
  };