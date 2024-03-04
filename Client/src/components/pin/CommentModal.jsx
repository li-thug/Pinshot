import { useState } from "react";
import { Offcanvas, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import TimeAgo from "timeago-react";
import { AiFillLike, AiFillDelete } from "react-icons/ai";
import PropTypes from "prop-types";
import { avatar } from "@assets";

export default function CommentModal({
  pinComments,
  handleLike,
  handleDislike,
  deleteComment,
  loggedInUser,
}) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <p className="cursor fw-meduim small" onClick={handleShow}>
        See all comments
      </p>
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Comments</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {pinComments.map((comment) => (
            <div key={comment._id} className="d-flex gap-2 mb-3">
              <div className="d-flex gap-2">
                <Link to={`/profile/${comment?.userId.userName}`}>
                  <Image
                    src={
                      comment?.userId.profilePhoto
                        ? comment?.userId.profilePhoto
                        : avatar
                    }
                    roundedCircle
                    style={{ width: "25px", height: "25px" }}
                    alt={comment?.userId?.userName}
                    className="object-fit-cover"
                  />
                </Link>
                <span className="fw-bold">{comment?.userId?.userName}</span>
              </div>
              <div>
                <span>{comment.comment}</span>
                <div className="d-flex align-items-center gap-3">
                  <TimeAgo
                    datetime={comment.createdAt}
                    locale="en_US"
                    style={{ fontSize: "14px" }}
                  />
                  <div>
                    <AiFillLike
                      size="20px"
                      className={`cursor me-2 ${
                        comment?.likes?.includes(loggedInUser._id)
                          ? "text-danger"
                          : ""
                      }`}
                      onClick={
                        comment?.likes?.includes(loggedInUser._id)
                          ? () => handleDislike(comment._id)
                          : () => handleLike(comment._id)
                      }
                    />
                    <span style={{ fontSize: "14px" }}>
                      {comment.likeCount} likes
                    </span>
                    {loggedInUser._id === comment?.userId._id && (
                      <AiFillDelete
                        size="20px"
                        className="cursor mx-3"
                        onClick={() => deleteComment(comment._id)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

CommentModal.propTypes = {
  pinComments: PropTypes.array,
  loggedInUser: PropTypes.any,
  handleLike: PropTypes.any,
  handleDislike: PropTypes.any,
  deleteComment: PropTypes.any,
};
