import Axios from "axios";

/**
 * checkIfAuthenticated()
 *
 * Check if any route is authenticated or not
 */
export const checkIfAuthenticated = () => {
  const getLoginData = localStorage.getItem("loginData");
  if (getLoginData != null && getLoginData !== "null") {
    try {
      const data = JSON.parse(getLoginData);
      if (data && data.success && data.access_token) {
        return data.user;
      }
    } catch (e) {
      return false;
    }
  }
  return false;
};

/**
 * registerUser()
 *
 * @param {object} data
 */
export const registerUser = async (data) => {
  return await Axios.post("/api/auth/register", data)
    .then((res) => res.data)
    .catch((err) => (err.response ? err.response.data : { success: false, message: "Network Error" }));
};

/**
 * loginUser()
 *
 * @param {object} data
 */
export const loginUser = async (data) => {
  return await Axios.post("/api/auth/login", data)
    .then((res) => res.data)
    .catch((err) => (err.response ? err.response.data : { success: false, message: "Network Error" }));
};
