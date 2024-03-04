import { connect, authHeader } from "@config";

const getPinComments = async (pinId) => {
  return await connect.get(`/comment/${pinId}`, {
    headers: authHeader(),
  });
};

const likeAComment = async (commentId, userId) => {
  return await connect.put(`/comment/${commentId}/like`, userId, {
    headers: authHeader(),
  });
};

const dislikeAComment = async (commentId, userId) => {
  return await connect.put(`/comment/${commentId}/dislike`, userId, {
    headers: authHeader(),
  });
};

const deleteAComment = async (commentId) => {
  return await connect.delete(`/comment/${commentId}`, {
    headers: authHeader(),
  });
};

const postAComment = async (pinId, comment) => {
  return await connect.post(
    `/comment/${pinId}/add`,
    { comment },
    {
      headers: authHeader(),
    }
  );
};

export default {
  getPinComments,
  likeAComment,
  dislikeAComment,
  deleteAComment,
  postAComment,
};