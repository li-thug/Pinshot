import { connect, authHeader } from "@config";

const getRandomPins = async (page = 1) => {
  return await connect.get(`/pin/random-explore?page=${page}`);
};

const getFollowedPins = async (page = 1) => {
  return await connect.get(`/pin/followed?page=${page}`, {
    headers: authHeader(),
  });
};

const getAPin = async (pinId) => {
  return await connect.get(`/pin/${pinId}`);
};

const likeAPin = async (pinId, userId) => {
  return await connect.put(`/pin/like/${pinId}`, userId, {
    headers: authHeader(),
  });
};
const dislikeAPin = async (pinId, userId) => {
  return await connect.put(`/pin/dislike/${pinId}`, userId, {
    headers: authHeader(),
  });
};

const getRelatedPins = async (pinId) => {
  return await connect.get(`/pin/${pinId}/related`);
};

const getPinsByUser = async (userId) => {
  return await connect.get(`/pin/${userId}/userpins`, {
    headers: authHeader(),
  });
};

const deleteAPin = async (pinId) => {
  return await connect.delete(`/pin/${pinId}`, {
    headers: authHeader(),
  });
};

const getPinsLikedByUser = async (userId) => {
  return await connect.get(`/pin/${userId}/likedpins`, {
    headers: authHeader(),
  });
};

export default {
  getRandomPins,
  getFollowedPins,
  getAPin,
  likeAPin,
  dislikeAPin,
  getRelatedPins,
  getPinsByUser,
  deleteAPin,
  getPinsLikedByUser
};
