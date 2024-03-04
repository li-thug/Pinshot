import { Link } from "react-router-dom";
import { Form, Image } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useFetch, useAuthContext } from "@hooks";
import { FormFields } from "@layouts";
import { ClipLoader } from "react-spinners";
import { registerOptions } from "@utils";
import { MyButton, CommentModal } from "@components";
import { IoMdSend } from "react-icons/io";
import { commentService } from "@services";
import TimeAgo from "timeago-react";
import { AiFillLike, AiFillDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { avatar } from "@assets";

export default function Comment({ pinId }) {
  const { loggedInUser } = useAuthContext() || {};
  const {
    error,
    loading,
    data: pinComments,
    setData,
  } = useFetch(commentService.getPinComments, pinId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleLike = async (commentId) => {
    try {
      const res = await commentService.likeAComment(
        commentId,
        loggedInUser._id
      );
      if (res.status === 200) {
        const { data } = await commentService.getPinComments(pinId);
        setData(data);
        toast.success(res.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data || "Unable to like comment");
    }
  };

  const handleDislike = async (commentId) => {
    try {
      const res = await commentService.dislikeAComment(
        commentId,
        loggedInUser._id
      );
      if (res.status === 200) {
        const { data } = await commentService.getPinComments(pinId);
        setData(data);
        toast.success(res.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data || "Unable to dislike comment");
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const res = await commentService.deleteAComment(
        commentId,
        loggedInUser._id
      );
      if (res.status === 200) {
        setData(
          pinComments.filter(
            (existingComment) => existingComment._id !== commentId
          )
        );
        toast.success(res.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.error || "Unable to delete comment");
    }
  };

  const onFormSubmit = async ({ comment }) => {
    try {
      const res = await commentService.postAComment(pinId, comment);
      if (res.status === 201) {
        const { data } = await commentService.getPinComments(pinId);
        setData(data);
        toast.success(res.data.msg);
        reset();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.error || "Unable to post comment");
    }
  };

  {
    error && <p>{error}</p>;
  }

  console.log(pinComments);

  return (
    <div className="my-5">
      <>
        {loading ? (
          <div className="d-flex justify-content-center">
            <ClipLoader color="#dd5e14" />
          </div>
        ) : (
          <>
            {pinComments?.length > 0 ? (
              <div className="my-4">
                {pinComments.slice(0, 5).map((comment) => (
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
                      <span className="fw-bold">
                        {comment?.userId?.userName}
                      </span>
                    </div>
                    <div>
                      <span className="small">{comment.comment}</span>
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
              </div>
            ) : (
              <p className="fw-bold">
                {pinComments?.length > 0
                  ? `${pinComments?.length} comments`
                  : "No comments yet. Be the first to add"}
              </p>
            )}
          </>
        )}
      </>

      {pinComments?.length > 5 && (
        <CommentModal
          pinComments={pinComments}
          handleLike={handleLike}
          handleDislike={handleDislike}
          deleteComment={deleteComment}
          loggedInUser={loggedInUser}
        />
      )}
      <div className="d-flex mt-4">
        <Form
          className="w-100 d-flex gap-2 align-items-center"
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <Image
            src={loggedInUser.profilePhoto ? loggedInUser.profilePhoto : avatar}
            roundedCircle
            style={{ width: "45px", height: "45px" }}
            alt={loggedInUser.userName}
            className="object-fit-cover"
          />
          <FormFields
            as="textarea"
            rows={2}
            register={register}
            errors={errors?.comment}
            registerOptions={registerOptions?.comment}
            className="w-100 ms-2"
            id="comment"
            name="comment"
            label="Leave a comment... 😃"
          />
          <MyButton
            text={isSubmitting ? <ClipLoader color="#dd5e14" /> : <IoMdSend />}
            variant="none"
            type="submit"
            disabled={isSubmitting}
          />
        </Form>
      </div>
    </div>
  );
}

Comment.propTypes = {
  pinId: PropTypes.string,
};