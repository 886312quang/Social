
const checkToken = () => {
  const exp = window.localStorage.getItem("exp");
  const refreshToken = window.localStorage.getItem("refresh-token");

  const date = new Date().getTime();

  if (exp && exp < date / 1000) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("exp");
    localStorage.removeItem("iat");
  }
};

export const isAuthenticated = () => {
  if (typeof window === "undefined") return true;
  //checkToken();
  const accessToken = window.localStorage.getItem("accessToken");

  if (accessToken) {
    let token = JSON.parse(accessToken);

    if (token) return token;

    return false;
  } else {
    return false;
  }
};

/* export const isAuthenticated = () => {
  if (typeof window === "undefined") return true;
  let data = window.localStorage.getItem("asauth");

  if (data) {
    let token = JSON.parse(data).token.accessToken;
    if (token) return token;
  }
  return false;
};
 */
