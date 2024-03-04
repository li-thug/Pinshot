import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { useAuthContext } from "@hooks";
import { MyButton, MyModal } from "@components";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import PropTypes from "prop-types";

export default function ImageModal({
  showPicModal,
  setShowPicModal,
  data,
  deletePin,
  prevSlide,
  nextSlide,
  current,
}) {
  const { loggedInUser } = useAuthContext();
  const handleClose = () => setShowPicModal(false);

  const deletePost = (pinId) => {
    deletePin(pinId);
    handleClose();
  };
  return (
    <MyModal
      show={showPicModal}
      handleClose={handleClose}
      fullscreen
      backdrop="static"
    >
      <div className="container position-relative w-100 min-h-100">
        {data?.map(
          (item, i) =>
            i === current && (
              <div key={item._id}>
                <Link to={`/pin/${item._id}`}>
                  <LazyLoadImage
                    effect="blur"
                    src={item?.image[0]}
                    alt={item.title}
                    className="cursor px-md-2"
                    width={"100%"}
                    height={"100%"}
                  />
                </Link>
                <>
                  <IoMdArrowDropleft
                    className="position-absolute top-50 start-0 translate-middle z-2 cursor"
                    size="50px"
                    color="#dd5e14"
                    onClick={prevSlide}
                  />
                  <IoMdArrowDropright
                    className="position-absolute top-50 start-100 translate-middle z-2 cursor"
                    size="50px"
                    color="#dd5e14"
                    onClick={nextSlide}
                  />
                  {loggedInUser._id === item.userId && (
                    <div className="my-3 d-flex justify-content-center">
                      <MyButton
                        text="Delete pin"
                        style={{ backgroundColor: "var(--orangeLight)" }}
                        onClick={() => deletePost(item._id)}
                      />
                    </div>
                  )}
                </>
              </div>
            )
        )}
      </div>
    </MyModal>
  );
}

ImageModal.propTypes = {
  pinId: PropTypes.string,
  showPicModal: PropTypes.any,
  setShowPicModal: PropTypes.any,
  current: PropTypes.number,
  setCurrent: PropTypes.any,
  setData: PropTypes.any,
  data: PropTypes.any,
  deletePin: PropTypes.func,
  prevSlide: PropTypes.func,
  nextSlide: PropTypes.func,
};
