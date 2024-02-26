const authHeader = () => {
  const token = JSON.parse(localStorage.getItem("usertoken"));
  if (token) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
};

export default authHeader;
