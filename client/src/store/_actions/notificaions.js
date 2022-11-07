import * as constants from "../../constants/notification";
import Errors from "../../helpers/errors";
import services from "../../services/notification";

const actions = {
  getNotifications: () => async (dispatch) => {
    try {
      dispatch({ type: constants.NOTIFICATION_GET_START });

      let response = await services.getNotifications();
      console.log("notify", response);
      dispatch({
        type: constants.NOTIFICATION_GET_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      Errors.handle(error);
      dispatch({ type: constants.NOTIFICATION_GET_ERROR });
    }
  },
  markNotify: (id) => async (dispatch) => {
    try {
      dispatch({ type: constants.NOTIFICATION_MARK_START });

      let response = await services.markNotify(id);
      dispatch({
        type: constants.NOTIFICATION_MARK_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      Errors.handle(error);
      dispatch({ type: constants.NOTIFICATION_MARK_ERROR });
    }
  },
};

export default actions;
