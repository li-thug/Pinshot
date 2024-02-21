import { createContext, useMemo, useState } from "react";
import PropTypes from "prop-types";

export const AuthContent = createContext();

export default function AuthProvider({ children }) {
  const { fecthUser, setLoggedInUser } = useState("");
  const LoggedInUser = useMemo(() => fecthUser, [fecthUser]);
  return (
    <AuthContent.Provider value={{ LoggedInUser }}>
      {children}
    </AuthContent.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
