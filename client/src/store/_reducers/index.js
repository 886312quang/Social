import { connectRouter } from "connected-react-router";
import { combineReducers } from "redux";
import layout from "./layout";
import auth from "./auth";
import user from "./user";
import message from "./message";
import contact from "./contact";
import call from "./call";
import mode from "./mode";

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    layout,
    auth,
    contact,
    user,
    message,
    call,
    mode,
  });
