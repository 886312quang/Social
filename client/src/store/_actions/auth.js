import * as constants from "../../constants/auth";
import { getHistory } from "../../configs/configureStore";
import {
  fetchSignin,
  fetchSignup,
  fetchChangePassword,
  fetchSendResetPassword,
  fetchVerifyEmailAccount,
  getVerify2FA,
  postEnable2FA,
  postVerify2FA,
  toggle2FA
} from "../../services/auth";
import Errors from "../../helpers/errors";
import notify from "../../components/notifications/notifications";
import { socketDisconnect, configSocket } from "../../sockets/rootSocket";
import { initSetting } from "../../configs/settings";
import { isAuthenticated } from "../../router/permissionChecker";

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

    getHistory().push("/auth/sign-in");
    dispatch({ type: "RESET" });
  },

  doSignin: (userInfo) => async (dispatch) => {
    try {
      dispatch({ type: constants.SIGNIN_START });

      let response = await fetchSignin(userInfo);
      window.localStorage.setItem("asauth", JSON.stringify(response.data));
      window.localStorage.setItem(
        "accessToken",
        JSON.stringify(response.data.accessToken)
      );
      window.localStorage.setItem(
        "refresh-token",
        JSON.stringify(response.data.refreshToken)
      );
      window.localStorage.setItem("exp", JSON.stringify(response.data.exp));
      window.localStorage.setItem("iat", JSON.stringify(response.data.iat));
      dispatch({
        type: constants.UPDATE_INFO,
        payload: response.data,
      });

      let token = isAuthenticated();

      dispatch({
        type: constants.SIGNIN_SUCCESS,
        payload: {
          token,
          message: response.data.message,
          verify2FA: response.data.verify2FA,
          enable2FA: response.data.enable2FA,
        },
      });

      getHistory().push("/");
      configSocket();
      initSetting();
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data) {
        notify.error(error.response.data.message);
      } else {
        notify.error("Error server");
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
      console.log(response.data);
      /* console.log(response);
      window.localStorage.setItem("asauth", JSON.stringify(response.data)); */
      if (response.data.success) {
        dispatch({
          type: constants.SIGNUP_SUCCESS,
          payload: response.data,
        });

        notify.success(response.data.message);
        setTimeout(() => {
          getHistory().push("/auth/sign-in");
        }, 3000);
      } else {
        notify.warning(response.data.message.message);
        dispatch({
          type: constants.SIGNUP_ERROR,
          payload: Errors.selectMessage(response.data.message),
        });
      }
    } catch (error) {
      notify.error(error);
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
      notify.success("Reset email sent. Please check your inbox!");
      getHistory().push("/auth/sign-in");
    } catch (error) {
      notify.error(error.response.data.message);
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
      notify.success("Your password has been changed successfully!");
      getHistory().push("/auth/sign-in");
    } catch (error) {
      notify.error(error.response.data.message);
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
      notify.success(response.data.message);

      setTimeout(() => {
        getHistory().push("/auth/sign-in");
      }, 3000);
    } catch (error) {
      notify.error(error.response.data.message);
      dispatch({
        type: constants.VERIFY_EMAIL_ACCOUNT_ERROR,
        payload: Errors.selectMessage(error),
      });
    }
  },
  getVerify2FA: () => async (dispatch) => {
    try {
      dispatch({ type: constants.VERIFY_2FA });

      // call api: verify email
      let response = await getVerify2FA();

      dispatch({
        type: constants.VERIFY_2FA_SUCCESS,
        payload: response.data,
      });

    } catch (error) {
      notify.error(error.response.data.message);
      localStorage.clear();
      getHistory().push("/auth/sign-in");
      dispatch({
        type: constants.VERIFY_2FA_ERROR,
        payload: Errors.selectMessage(error),
      });
    }
  },
  postEnable2FA: () => async (dispatch) => {
    try {
      dispatch({ type: constants.ENABLE_2FA });

      // call api: verify email
      let response = await postEnable2FA();

      dispatch({
        type: constants.ENABLE_2FA_SUCCESS,
        payload: response.data.QRCodeImage,
      });

    } catch (error) {
      notify.error(error.response.data.message);
      localStorage.clear();
      getHistory().push("/auth/sign-in");
      dispatch({
        type: constants.ENABLE_2FA_ERROR,
        payload: Errors.selectMessage(error),
      });
    }
  },
  postVerify2FA: (data) => async (dispatch) => {
    try {
      dispatch({ type: constants.POST_VERIFY_2FA });

      // call api: verify email
      let response = await postVerify2FA(data);

      if (response.data.isValid) {
        dispatch({
          type: constants.POST_VERIFY_2FA_SUCCESS,
          payload: response.data,
        });
        notify.success("Verify Success!");
        getHistory().push("/");
      } else {
        notify.error("Verify Fail!");
      }
    } catch (error) {
      localStorage.clear();
      getHistory().push("/auth/sign-in");
      notify.error(error.response.data.message);
      dispatch({
        type: constants.POST_VERIFY_2FA_ERROR,
        payload: Errors.selectMessage(error),
      });
    }
  },
  toggle2FA: () => async (dispatch) => {
    try {
      let response = await toggle2FA();

      if (response.data.status) {
        dispatch({
          type: constants.TOGGLE_2FA,
          payload: response.data,
        });

        dispatch({
          type: constants.ENABLE_2FA_SUCCESS,
          payload: response.data.QRCodeImage,
        });
        notify.success("Enable 2FA successfull!");
      } else {
        notify.success("Disable 2FA successfull!");
      }
    } catch (error) {
      notify.error(error.response.data.message);
    }
  },
};
export default actions;
