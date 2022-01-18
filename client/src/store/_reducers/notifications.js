import * as constants from "../../constants/notification";
import produce from "immer";

const initialState = {
  initLoading: true,
  dataLoading: false,
  findLoading: false,
  error: null,
  notifyLoading: false,
  notifys: [],
  countNotify: 0,
};

const contactReducer = (state = initialState, { type, payload }) =>
  produce(state, (draft) => {
    switch (type) {
      case constants.NOTIFICATION_GET_START:
        draft.Loading = true;
        draft.error = null;
        break;
      case constants.NOTIFICATION_GET_SUCCESS:
        draft.Loading = false;
        draft.notifys = payload;
        draft.notifys.forEach((item) => {
          if (!item.isRead) {
            draft.countNotify = state.countNotify + 1;
          }
        });
        draft.error = null;
        break;
      case constants.NOTIFICATION_GET_ERROR:
        draft.Loading = false;
        draft.notifys = [];
        draft.error = payload;
        break;
      case constants.NOTIFICATION_MARK_START:
        draft.Loading = true;
        draft.error = null;
        break;
      case constants.NOTIFICATION_MARK_SUCCESS:
        draft.Loading = false;
        draft.notifys.forEach((item, index) => {
          if (item.id === payload && !item.isRead) {
            draft.notifys[index].isRead = true;
            draft.countNotify = state.countNotify - 1;
          }
        });

        draft.error = null;
        break;
      case constants.NOTIFICATION_MARK_ERROR:
        draft.Loading = false;
        draft.notifys = [];
        draft.error = payload;
        break;
      case constants.ON_NOTIFICATION_REQUEST_ADD:
        draft.Loading = false;
        draft.notifys.unshift(payload);
        draft.countNotify = state.countNotify + 1;
        draft.error = payload;
        break;
      case constants.ON_REMOVE_NOTIFICATION:
        draft.countNotify = state.countNotify - 1;
        draft.notifys = state.notifys.filter(
          (item) => item._id !== payload._id
        );
        break;
      default:
        break;
    }
  });

export default contactReducer;
