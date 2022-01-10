import { isAuthenticated } from "./permissionChecker";
import React, { useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import userActions from "../store/_actions/user";
import authActions from "../store/_actions/auth";
import userSelectors from "../store/_selectors/user";
import authSelectors from "../store/_selectors/auth";
import { configSocket } from "../sockets/rootSocket";

const PrivateRoute = ({ component: Component, ...rest }) => {
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
      configSocket();
      //emitCheckStatus();
    }
    // dispatch(socketActions.doConnect());
    if (!currentUser && isAuthenticated()) {
      dispatch(userActions.getCurrentUser());
      dispatch(authActions.getVerify2FA());
    }
  }, [enable2FA, verify2FA]);
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated() && !check2FA()  ? (
          <Redirect
            to={{
              pathname:"/auth/2FA",
              state: { from: props.location },
            }}
          />
        ) : !isAuthenticated() ? (
          <Redirect
            to={{
              pathname:  "/auth/sign-in",
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

export default PrivateRoute;
