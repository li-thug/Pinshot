import { connect, authHeader } from "@config";

const login = async (userName, password) => {
  return await connect.post("/auth/login", { userName, password });
};

const authUser = async () => {
  return connect.get("/auth", { headers: authHeader() });
};

export default {
  login,
  authUser,
};
