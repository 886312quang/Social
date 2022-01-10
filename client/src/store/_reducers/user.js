import * as constants from "../../constants/user";
import * as constantsContact from "../../constants/contact";
import produce from "immer";

const initialState = {
  initLoading: true,
  dataLoading: false,
  findLoading: false,
  saveLoading: false,
  deleteLoading: false,
  exportLoading: false,
  error: null,
  redirectTo: "/contact",
  record: null,
  users: [],
  current: null,
};

const userReducer = (state = initialState, { type, payload }) =>
  produce(state, (draft) => {
    switch (type) {
      case constants.USER_GET_CURRENT_SUCCESS:
        draft.current = payload;
        break;
      case constants.USER_GET_START:
        draft.findLoading = true;
        draft.error = null;
        break;
      case constants.USER_GET_SUCCESS:
        draft.findLoading = false;
        draft.users = payload;
        draft.error = null;
        break;
      case constants.USER_GET_ERROR:
        draft.findLoading = false;
        draft.error = payload;
        break;
      case constants.USER_UPDATE_START:
      case constants.USER_UPDATE_PASSWORD_START:
        draft.saveLoading = true;
        break;
      case constants.USER_UPDATE_PASSWORD_SUCCESS:
        draft.saveLoading = false;
        break;
      case constants.USER_UPDATE_ERROR:
      case constants.USER_UPDATE_PASSWORD_ERROR:
        draft.saveLoading = false;
        break;
      case constants.USER_UPDATE_SUCCESS:
        draft.saveLoading = false;
        draft.current = payload;
        break;
      case constantsContact.CONTACT_CREATE_SUCCESS:
        draft.users.forEach((user) => {
          if (user._id == payload._id) {
            user.status = true;
          }
        });
        break;
      case constantsContact.CONTACT_REMOVE_SENT_SUCCESS:
        draft.users.forEach((user) => {
          if (user._id == payload.contactId) {
            user.status = false;
          }
        });
        break;
      case constantsContact.ON_ACCEPT_REQUEST_ADD:
        draft.users = state.users.filter((user) => user._id !== payload._id);
        break;
      case constants.USER_FIND_START:
        draft.findLoading = true;
        draft.error = null;
        break;
      case constants.USER_FIND_SUCCESS:
        draft.findLoading = false;
        draft.record = payload;
        draft.error = null;
        break;
      case constants.USER_FIND_ERROR:
        draft.findLoading = false;
        draft.error = payload;
        break;
      case constants.USER_CHANGE_AVATAR:
        draft.current.avatar = payload;
        break;
      default:
        break;
    }
  });

export default userReducer;
