import * as React from "react";
import { BASE_URL, PATH_URL } from "src/config.json";
const axios = require("axios").default;

export const authService = {
  isAuthenticated: false,
  checkAuth() {
    return new Promise((resolve) => {
      let loginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));
      if (loginInfo && loginInfo != null) {
        this.isAuthenticated = true;
      } else {
        this.isAuthenticated = false;
      }
      resolve(this.isAuthenticated);
    });
  },
  logout() {
    return new Promise((resolve) => {
      sessionStorage.removeItem("loginInfo");
      // setAuthed(false);

      this.isAuthenticated = false;
      resolve(this.isAuthenticated);
    });
  },
  login(req) {
    return new Promise(async (resolve) => {
      const baseEndpoint = BASE_URL + PATH_URL;
      const pathEndpoint = "teacher/login";
      const requestBody = {
        teacherUsername: req.username,
        teacherPassword: req.password,
      };
      try {
        const result = await axios.post(
          baseEndpoint + pathEndpoint,
          requestBody
        );
        console.log(result);
        if (result.data.statusCode === 0 && result.status === 200) {
          let loginInfo = result.data.data[0];
          sessionStorage.setItem("loginInfo", JSON.stringify(loginInfo));

          resolve(result.data);
        } else {
          resolve(result.data.statusMessage);
        }
      } catch (e) {
        console.log(e);
        resolve(e.message);
      }
    });
  },
};

//deprecated cannot be used
export function useAuth() {
  const [authed, setAuthed] = React.useState(false);
  const checkAuth = (_) => {
    return new Promise((resolve) => {
      let loginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));
      if (loginInfo && loginInfo != null) {
        setAuthed(true);
      } else {
        setAuthed(true);
      }
      resolve(authed);
    });
  };
  const logout = (_) => {
    return new Promise((resolve) => {
      sessionStorage.removeItem("loginInfo");
      setAuthed(false);
      resolve(authed);
    });
  };
  const login = (req) => {
    return new Promise(async (resolve) => {
      const baseEndpoint = BASE_URL + PATH_URL;
      const pathEndpoint = "teacher/login";
      const requestBody = {
        teacherUsername: req.username,
        teacherPassword: req.password,
      };
      try {
        const result = await axios.post(
          baseEndpoint + pathEndpoint,
          requestBody
        );
        if (result.data.statusCode === 0 && result.status === 200) {
          let loginInfo = result.data.data[0];
          sessionStorage.setItem("loginInfo", JSON.stringify(loginInfo));
          setAuthed(true);
          resolve(authed);

          // resolve(true)
        } else {
          resolve(result.data.statusMessage);
        }
      } catch (e) {
        console.log(e);
        resolve(e);
      }
    });
  };
  return {
    authed,
    login,
    logout,
    checkAuth,
  };
}
