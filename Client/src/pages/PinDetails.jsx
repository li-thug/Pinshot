import { useState } from "react";
import { PageLayout } from "@layouts";
import { useFetch, useSlide, useTitle, useAuthContext } from "@hooks";
import { useParams, Link } from "react-router-dom";
import { pinService, userService } from "@services";
import { Spinner, downloadImage } from "@utils";
import { Row, Col, Image } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FaExpand, FaHeart } from "react-icons/fa";
import {
  IoMdArrowDropleft,
  IoMdArrowDropright,
  IoMdDownload,
} from "react-icons/io";
import {
  PinModal,
  MyButton,
  Comments,
  MasonryLayout,
  PinCard,
} from "@components";
import { toast } from "react-toastify";
import { avatar } from "@assets";

export default function PinDetails() {
  const [showPicModal, setShowPicModal] = useState(false);
  const { pinId } = useParams();
  const {
    error,
    data: pin,
    loading,
    setData,
  } = useFetch(pinService.getAPin, pinId);
  const { error: err, data: relatedPins } = useFetch(
    pinService.getRelatedPins,
    pinId
  );
  const { nextSlide, prevSlide, current, setCurrent } = useSlide(
    pin?.image?.length
  );
  const { loggedInUser, setLoggedInUser } = useAuthContext() || {};
  useTitle(pin?.title);
  uuidv4();

  const expandImg = (index) => {
    setShowPicModal(true);
    setCurrent(index);
  };

  const handleLike = async () => {
    try {
      const res = await pinService.likeAPin(pinId, loggedInUser._id);
      toast.success(res.data);
      const pin = await pinService.getAPin(pinId);
      setData(pin.data);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.error);
    }
  };

  const handleDislike = async () => {
    try {
      const res = await pinService.dislikeAPin(pinId, loggedInUser._id);
      toast.success(res.data);
      const pin = await pinService.getAPin(pinId);
      setData(pin.data);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.error);
    }
  };

  const follow = async (pinUserId) => {
    try {
      const res = await userService.followAUser(pinUserId, loggedInUser._id);
      if (res.status === 200) {
        const pin = await pinService.getAPin(pinId);
        setData(pin.data);
        const user = await userService.authUser();
        setLoggedInUser(user.data);
        toast.success(res.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.error);
    }
  };

  const unfollow = async (pinUserId) => {
    try {
      const res = await userService.unfollowAUser(pinUserId, loggedInUser._id);
      if (res.status === 200) {
        const pin = await pinService.getAPin(pinId);
        setData(pin.data);
        const user = await userService.authUser();
        setLoggedInUser(user.data);
        toast.success(res.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.error);
    }
  };

  const isLiked = pin.likes?.includes(loggedInUser._id);
  const isFollowed = loggedInUser.following?.includes(pin.userId?._id);

  return (
    <PageLayout>
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          {loading && <Spinner text="Fetching pin" />}
          <Row className="g-3">
            <Col lg={6} className="mb-4">
              <div className="w-100">
                {pin.image?.map((img, i) => (
                  <div key={uuidv4()} className="pinId-Img position-relative">
                    {i === current && (
                      <div>
                        <LazyLoadImage
                          effect="blur"
                          src={img}
                          alt={pin.title}
                          className="rounded-4 object-fit-cover"
                          width="100%"
                          height={600}
                        />
                        <div
                          className="position-absolute top-0 end-0 p-2"
                          title="click to view full size"
                        >
                          <FaExpand
                            color="white"
                            className="cursor"
                            size="24px"
                            onClick={() => expandImg(i)}
                          />
                        </div>
                        {pin.image?.length > 1 && (
                          <div className="focus-arrow d-none d-md-flex w-100 justify-content-between position-absolute top-50 z-2">
                            <IoMdArrowDropleft
                              className="cursor"
                              size="50px"
                              color="#ffffff"
                              onClick={prevSlide}
                            />
                            <IoMdArrowDropright
                              className="cursor"
                              size="50px"
                              color="#ffffff"
                              onClick={nextSlide}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <>
                  {pin.image?.length > 1 && (
                    <div className="mt-3 d-flex d-md-none gap-2">
                      {pin.image?.map((img, i) => (
                        <Image
                          key={uuidv4()}
                          src={img}
                          onClick={() => setCurrent(i)}
                          style={{ width: "50px", height: "50px" }}
                          className={
                            i === current
                              ? "rounded-4 border border-2 border-warning"
                              : "rounded-4 "
                          }
                        />
                      ))}
                    </div>
                  )}
                </>
                <>
                  {showPicModal && (
                    <PinModal
                      showPicModal={showPicModal}
                      setShowPicModal={setShowPicModal}
                      current={current}
                      pin={pin}
                      prevSlide={prevSlide}
                      nextSlide={nextSlide}
                    />
                  )}
                </>
              </div>
            </Col>
            <Col lg={6} className="mb-4 px-lg-4">
              <h1 className="fw-bold mb-4 display-6">{pin.title}</h1>
              <p className="mb-4">{pin.description}</p>
              <div className="mb-4 d-flex justify-content-between justify-content-md-start w-100 gap-md-4">
                <div>
                  {pin.image?.map((img, i) => (
                    <div key={uuidv4()} title="download this image">
                      {i === current && (
                        <IoMdDownload
                          size="30px"
                          className="cursor"
                          onClick={() => downloadImage(pin.title, img)}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="d-flex align-items-center gap-2">
                  <FaHeart
                    size="28px"
                    className={`cursor ${isLiked ? "text-danger" : ""}`}
                    title={isLiked ? "You liked this pin" : "Click to like"}
                    onClick={isLiked ? handleDislike : handleLike}
                  />
                  <span>{pin.likes?.length} likes</span>
                </div>
              </div>
              <div className="d-flex gap-2 flex-wrap mb-4">
                <span>Tags:</span>
                {pin.tags?.map((tag) => (
                  <MyButton
                    key={uuidv4()}
                    className="mx-1 icon bg-secondary-subtle text-black text-lowercase"
                    size="sm"
                    text={tag}
                  />
                ))}
              </div>
              <div className="d-flex align-items-center ">
                <div className="d-flex align-items-center gap-2 flex-grow-1">
                  <Link to={`/profile/${pin.userId?.userName}`}>
                    <Image
                      src={
                        pin.userId?.profilePhoto
                          ? pin.userId?.profilePhoto
                          : avatar
                      }
                      roundedCircle
                      style={{ width: "45px", height: "45px" }}
                      alt={pin.userId?.userName}
                    />
                  </Link>
                  <div>
                    <Link
                      to={`/profile/${pin.userId?.userName}`}
                      className="fs-6 fw-bold"
                    >
                      {pin.userId?.userName}
                    </Link>
                    <div>{pin.userId?.followers?.length} followers</div>
                  </div>
                </div>
                {loggedInUser._id !== pin.userId?._id && (
                  <MyButton
                    text={isFollowed ? "Unfollow" : "Follow"}
                    style={{
                      backgroundColor: isFollowed
                        ? "var(--teal200)"
                        : "var(--orangeLight",
                    }}
                    onClick={
                      isFollowed
                        ? () => unfollow(pin.userId?._id)
                        : () => follow(pin.userId?._id)
                    }
                  />
                )}
              </div>
              <Comments pinId={pinId} />
            </Col>
          </Row>
          <div className="mt-3">
            <h1 className="text-center display-6 fw-bold">More to explore</h1>
            {err && <p>{err}</p>}
            {relatedPins?.length > 0 ? (
              <div className="mt-4">
                <MasonryLayout>
                  {relatedPins.map((pin) => (
                    <PinCard key={pin._id} {...pin} />
                  ))}
                </MasonryLayout>
              </div>
            ) : (
              <p className="mt-4">
                {" "}
                Sorry we couldn&apos;t find any pins for recommendation.
              </p>
            )}
          </div>
        </>
      )}
    </PageLayout>
  );
}
