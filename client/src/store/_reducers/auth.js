import * as constants from "../../constants/auth";
import produce from "immer";

const initialState = {
  initLoading: true,
  signinLoading: false,
  signupLoading: false,
  sendResetPasswordLoading: false,
  sendResetPasswordError: null,
  changePasswordLoading: false,
  changePasswordError: null,
  signinError: null,
  signinSuccess: null,
  signupError: null,
  verifyEmailLoading: false,
  verifyEmailError: null,
  userInfo: null,
  token: null,
  enable2FA: false,
  verify2FA: false,
  QR2FA: null,
};

const authReducer = (state = initialState, { type, payload }) =>
  produce(state, (draft) => {
    switch (type) {
      case constants.SIGNIN_INIT_LOADING_DONE:
        draft.initLoading = false;
        break;
      case constants.SIGNIN_START:
        draft.signinLoading = true;
        draft.signinError = null;
        break;
      case constants.SIGNIN_SUCCESS:
        draft.signinLoading = false;
        draft.signinSuccess = payload.message;
        draft.token = payload.refreshToken;
        draft.signinError = null;
        draft.enable2FA = payload.enable2FA;
        draft.verify2FA = payload.verify2FA;
        break;
      case constants.SIGNIN_ERROR:
        draft.signinLoading = false;
        draft.signinError = payload || null;
        break;
      case constants.SIGNUP_START:
        draft.signupLoading = true;
        draft.signupError = null;
        break;
      case constants.SIGNUP_SUCCESS:
        draft.signupLoading = false;
        draft.signupError = null;
        break;
      case constants.SIGNUP_ERROR:
        draft.signupLoading = false;
        draft.signupError = payload || null;
        break;
      case constants.VERIFY_EMAIL_ACCOUNT_START:
        draft.verifyEmailLoading = true;
        draft.verifyEmailError = null;
        break;
      case constants.VERIFY_EMAIL_ACCOUNT_SUCCESS:
        draft.verifyEmailLoading = false;
        draft.verifyEmailError = null;
        break;
      case constants.VERIFY_EMAIL_ACCOUNT_ERROR:
        draft.verifyEmailLoading = false;
        draft.verifyEmailError = payload || null;
        break;
      case constants.SEND_RESET_PASSWORD_START:
        draft.sendResetPasswordLoading = true;
        draft.sendResetPasswordError = null;
        break;
      case constants.SEND_RESET_PASSWORD_SUCCESS:
        draft.sendResetPasswordLoading = false;
        break;
      case constants.SEND_RESET_PASSWORD_ERROR:
        draft.sendResetPasswordLoading = false;
        draft.sendResetPasswordError = payload || null;
        break;
      case constants.CHANGE_PASSWORD_START:
        draft.changePasswordLoading = true;
        draft.changePasswordError = null;
        break;
      case constants.CHANGE_PASSWORD_SUCCESS:
        draft.changePasswordLoading = false;
        break;
      case constants.CHANGE_PASSWORD_ERROR:
        draft.changePasswordLoading = false;
        draft.changePasswordError = payload || null;
        break;
      case constants.UPDATE_INFO:
        draft.userInfo = payload.user;
        draft.token = payload.accessToken;
        break;
      case constants.ERROR_MESSAGE_CLEAR:
        draft.signupError = null;
        draft.signinError = null;
        draft.signinSuccess = null;
        break;
      case constants.VERIFY_2FA:
        draft.enable2FA = false;
        draft.verify2FA = false;
        break;
      case constants.VERIFY_2FA_SUCCESS:
        draft.enable2FA = payload.enable2FA;
        draft.verify2FA = payload.verify2FA;
        break;
      case constants.ENABLE_2FA:
        draft.QR2FA = null;
        break;
      case constants.ENABLE_2FA_SUCCESS:
        draft.QR2FA = payload;
        break;
      case constants.ENABLE_2FA_ERROR:
        draft.QR2FA = null;
        break;
      case constants.POST_VERIFY_2FA_SUCCESS:
        draft.QR2FA = null;
        draft.verify2FA = payload;
        break;
      default:
        break;
    }
  });

export default authReducer;
