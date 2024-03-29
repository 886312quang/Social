import { createSelector } from "reselect";

const selectRaw = (state) => state.auth;

// select loading
const selectInitLoading = createSelector(
  [selectRaw],
  (auth) => auth.initLoading
);

const selectSigninLoading = createSelector(
  [selectRaw],
  (auth) => auth.signinLoading
);

const selectSignupLoading = createSelector(
  [selectRaw],
  (auth) => auth.signupLoading
);

// select success
const selectSigninSuccess = createSelector(
  [selectRaw],
  (auth) => auth.signinSuccess
);

// select errors
const selectSigninError = createSelector(
  [selectRaw],
  (auth) => auth.signinError
);
const selectSignupError = createSelector(
  [selectRaw],
  (auth) => auth.signupError
);
const selectSendResetPasswordLoading = createSelector(
  [selectRaw],
  (auth) => auth.sendResetPasswordLoading
);
const selectSendResetPasswordError = createSelector(
  [selectRaw],
  (auth) => auth.sendResetPasswordError
);
const selectChangePasswordLoading = createSelector(
  [selectRaw],
  (auth) => auth.changePasswordLoading
);

const selectChangePasswordError = createSelector(
  [selectRaw],
  (auth) => auth.changePasswordError
);

const selectUserInfo = createSelector([selectRaw], (auth) => auth.userInfo);

const selectToken = createSelector([selectRaw], (auth) => auth.token);

const selectEnable2FA = createSelector([selectRaw], (auth) => auth.enable2FA);
const selectVerify2FA = createSelector([selectRaw], (auth) => auth.verify2FA);

const selectQRFA = createSelector([selectRaw], (auth) => auth.QR2FA);

const selectors = {
  selectInitLoading,
  selectSigninLoading,
  selectSignupLoading,
  selectSigninSuccess,
  selectSigninError,
  selectSignupError,
  selectSendResetPasswordLoading,
  selectChangePasswordLoading,
  selectChangePasswordError,
  selectSendResetPasswordError,
  selectToken,
  selectUserInfo,
  selectEnable2FA,
  selectVerify2FA,
  selectQRFA,
};

export default selectors;
