import jwt from "jsonwebtoken";
import env from "../utlis/validateEnv.js";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, env.JWT_ACCESS_TOKEN, {
    expiresIn: "1d",
  });
};

export default generateToken;