import PropTypes from "prop-types";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { MyModal } from "@components";

export default function PinModal({
  setShowPicModal,
  showPicModal,
  current,
  pin,
  prevSlide,
  nextSlide,
}) {
  const handleClose = () => setShowPicModal(false);
  const imgSlides = pin.image.map((img) => img);

  return (
    <MyModal
      show={showPicModal}
      handleClose={handleClose}
      fullscreen
      backdrop="static"
    >
      <div className="container position-relative w-100 min-h-100">
        <LazyLoadImage
          effect="blur"
          src={imgSlides[current]}
          alt="pin-images"
          width="100%"
          height="100%"
          className="px-md-2 object-fit-cover"
        />
        {imgSlides?.length > 1 && (
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
          </>
        )}
      </div>
    </MyModal>
  );
}

PinModal.propTypes = {
  showPicModal: PropTypes.bool,
  setShowPicModal: PropTypes.bool,
  current: PropTypes.number,
  pin: PropTypes.object,
  prevSlide: PropTypes.func,
  nextSlide: PropTypes.func,
};
