import { connect, authHeader } from "@config";

const login = async (userName, password) => {
  return await connect.post("/auth/login", { userName, password });
};

const signup = async (userName, email, password) => {
  return await connect.post("/auth/signup", { userName, email, password });
};

const authUser = async () => {
  return connect.get("/auth", { headers: authHeader() });
};

const followAUser = async (followId, userId) => {
  return connect.put(`/auth/follow/${followId}`, userId, {
    headers: authHeader(),
  });
};

const unfollowAUser = async (followId, userId) => {
  return connect.put(`/auth/unfollow/${followId}`, userId, {
    headers: authHeader(),
  });
};

const logout = () => {
  localStorage.clear();
  window.location.reload();
};

export default {
  login,
  signup,
  authUser,
  followAUser,
  unfollowAUser,
  logout,
};
