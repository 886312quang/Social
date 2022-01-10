import { isAuthenticated } from "./permissionChecker";
import React, { useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import authSelectors from "../store/_selectors/auth";
import userActions from "../store/_actions/user";
import { useDispatch, useSelector } from "react-redux";
import authActions from "../store/_actions/auth";
import userSelectors from "../store/_selectors/user";

const AuthRoute = ({ component: Component, ...rest }) => {
  const currentUser = useSelector(userSelectors.selectCurrentUser);
  const enable2FA = useSelector(authSelectors.selectEnable2FA);
  const verify2FA = useSelector(authSelectors.selectVerify2FA);

  const dispatch = useDispatch();

  const check2FA = () => {
    if (enable2FA) {
      if (verify2FA) {
        return true;
      } else return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    if (isAuthenticated()) {
      //emitCheckStatus();
    }
    // dispatch(socketActions.doConnect());
    if (!currentUser && isAuthenticated()) {
      dispatch(userActions.getCurrentUser());
      dispatch(authActions.getVerify2FA());
    }
  }, []);

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated() && check2FA() ? (
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location },
            }}
          />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default AuthRoute;
