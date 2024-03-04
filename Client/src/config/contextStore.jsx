import {
  createContext,
  useEffect,
  useCallback,
  useState,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import { userService } from "@services";

let initialUser = "";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [fetchUser, setLoggedInUser] = useState(initialUser);
  const loggedInUser = useMemo(() => fetchUser, [fetchUser]);
  const token = JSON.parse(localStorage.getItem("usertoken"));

  useEffect(() => {
    const getUser = JSON.parse(localStorage.getItem("userinfo"));
    if (getUser) {
      setLoggedInUser(getUser);
    }
  }, []);

  useEffect(() => {
    // Persist state changes to localStorage
    if (loggedInUser !== initialUser) {
      localStorage.setItem("userinfo", JSON.stringify(loggedInUser));
    }
  }, [loggedInUser]);

  const getUser = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await userService.authUser();
      setLoggedInUser(data);
    } catch (error) {
      console.log(error);
    }
  }, [token, setLoggedInUser]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <AuthContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
