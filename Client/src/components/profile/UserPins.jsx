import { useState } from "react";
import PropTypes from "prop-types";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useFetch, useSlide } from "@hooks";
import { pinService } from "@services";
import { Spinner } from "@utils";
import { MasonryLayout, ImageModal } from "@components";
import { toast } from "react-toastify";

export default function UserPins({ userId }) {
  const { data, error, loading, setData } = useFetch(
    pinService.getPinsByUser,
    userId
  );
  const [showPicModal, setShowPicModal] = useState(false);

  const imgSlide = data.map((item) => item.image);
  const imgLength = imgSlide?.length;
  const { prevSlide, nextSlide, current, setCurrent } = useSlide(imgLength);

  const openModal = (i) => {
    setShowPicModal(true);
    setCurrent(i);
  };

  const deletePin = async (pinId) => {
    try {
      const res = await pinService.deleteAPin(pinId);
      toast.success(res.data);
      const { data } = await pinService.getPinsByUser(userId);
      setData(data);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.error);
    }
  };

  console.log("pp", data);

  return (
    <div className="mt-5">
      {error ? (
        <p className="mt-5">{error}</p>
      ) : (
        <>
          {" "}
          {loading ? (
            <Spinner text="Fetching pins" />
          ) : (
            <>
              {data?.length > 0 ? (
                <MasonryLayout>
                  {data.map((pin, i) => (
                    <div key={pin._id} className="w-100 h-auto rounded-4">
                      <LazyLoadImage
                        alt={pin.title}
                        effect="blur"
                        src={pin?.image[0]}
                        className="rounded-4 object-fit-cover cursor"
                        width={"100%"}
                        height={"100%"}
                        onClick={() => openModal(i)}
                      />
                      {showPicModal && (
                        <ImageModal
                          setShowPicModal={setShowPicModal}
                          showPicModal={showPicModal}
                          prevSlide={prevSlide}
                          nextSlide={nextSlide}
                          current={current}
                          data={data}
                          deletePin={deletePin}
                        />
                      )}
                    </div>
                  ))}
                </MasonryLayout>
              ) : (
                <p>No pins posted yet</p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
UserPins.propTypes = {
  userId: PropTypes.string,
};
