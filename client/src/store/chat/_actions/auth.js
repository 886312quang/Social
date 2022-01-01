import * as constants from "../constants/auth";
import { getHistory } from "../configs/configureStore";
import {
  fetchSignin,
  fetchSignup,
  fetchChangePassword,
  fetchSendResetPassword,
  fetchVerifyEmailAccount,
} from "../services/auth";
import Errors from "../components/Shared/error/errors";
import Message from "../components/Shared/message";
import { socketDisconnect, configSocket } from "../sockets/rootSocket";
import { initSetting } from "../components/Shared/settings";
import { isAuthenticated } from "../components/Shared/Routes/permissionChecker";

const actions = {
  doInitLoadingDone: () => {
    return { type: constants.SIGNIN_INIT_LOADING_DONE };
  },
  /* doClearErrorMessage: () => {
    return { type: constants.ERROR_MESSAGE_CLEAR };
  }, */

  doSignOut: () => (dispatch) => {
    window.localStorage.removeItem("asauth");
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("refresh-token");
    window.localStorage.removeItem("exp");
    window.localStorage.removeItem("iat");
    socketDisconnect();

    getHistory().push("/signin");
    dispatch({ type: "RESET" });
  },

  doSignin: (userInfo) => async (dispatch) => {
    try {
      dispatch({ type: constants.SIGNIN_START });

      let response = await fetchSignin(userInfo);
      window.localStorage.setItem("asauth", JSON.stringify(response.data));
      window.localStorage.setItem("accessToken", JSON.stringify(response.data.token.accessToken));
      window.localStorage.setItem("refresh-token", JSON.stringify(response.data.token.refreshToken));
      window.localStorage.setItem("exp", JSON.stringify(response.data.exp));
      window.localStorage.setItem("iat", JSON.stringify(response.data.iat));
      dispatch({
        type: constants.UPDATE_INFO,
        payload: response.data,
      });

      let token = isAuthenticated();

      dispatch({
        type: constants.SIGNIN_SUCCESS,
        payload: { token, message: response.data.message },
      });

      getHistory().push("/");
      configSocket();
      initSetting();
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data) {
        Message.error(error.response.data.message);
      } else {
        Message.error("Error server");
      }

      dispatch({
        type: constants.SIGNIN_ERROR,
        payload: Errors.selectMessage(error),
      });
    }
  },
  doSignup: (userInfo) => async (dispatch) => {
    try {
      dispatch({ type: constants.SIGNUP_START });

      // call api: signin
      let response = await fetchSignup(userInfo);
      /* console.log(response);
      window.localStorage.setItem("asauth", JSON.stringify(response.data)); */
      dispatch({
        type: constants.SIGNUP_SUCCESS,
        payload: response.data,
      });

      Message.success(response.data.message);
      setTimeout(() => {
        getHistory().push("/signin");
      }, 3000);
    } catch (error) {
      Message.error(error.response.data.message);
      dispatch({
        type: constants.SIGNUP_ERROR,
        payload: Errors.selectMessage(error),
      });
    }
  },

  doSendResetPassword: (email) => async (dispatch) => {
    try {
      dispatch({ type: constants.SEND_RESET_PASSWORD_START });

      // call api: signin
      let response = await fetchSendResetPassword(email);

      dispatch({
        type: constants.SEND_RESET_PASSWORD_SUCCESS,
        payload: response.data,
      });
      Message.success("Reset email sent. Please check your inbox!");
    } catch (error) {
      Message.error(error.response.data.message);
      dispatch({
        type: constants.SEND_RESET_PASSWORD_ERROR,
        payload: Errors.selectMessage(error),
      });
    }
  },
  doChangePassword: (data) => async (dispatch) => {
    try {
      dispatch({ type: constants.CHANGE_PASSWORD_START });

      // call api: signin
      let response = await fetchChangePassword(data);

      dispatch({
        type: constants.CHANGE_PASSWORD_SUCCESS,
        payload: response.data,
      });
      Message.success("Your password has been changed successfully!");
      getHistory().push("/signin");
    } catch (error) {
      Message.error(error.response.data.message);
      dispatch({
        type: constants.CHANGE_PASSWORD_ERROR,
        payload: Errors.selectMessage(error),
      });
    }
  },
  verifyEmailAccount: (data) => async (dispatch) => {
    try {
      dispatch({ type: constants.VERIFY_EMAIL_ACCOUNT_START });

      // call api: verify email
      let response = await fetchVerifyEmailAccount(data);

      dispatch({
        type: constants.VERIFY_EMAIL_ACCOUNT_SUCCESS,
        payload: response.data,
      });
      Message.success(response.data.message);

      setTimeout(() => {
        getHistory().push("/signin");
      }, 3000);
    } catch (error) {
      Message.error(error.response.data.message);
      dispatch({
        type: constants.VERIFY_EMAIL_ACCOUNT_ERROR,
        payload: Errors.selectMessage(error),
      });
    }
  },
};
export default actions;
