import * as constants from "../../constants/contact";
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
  selectedRowKeys: [],
  selectedRows: [],
  record: null,
  contactLoading: false,
  requestLoading: false,
  requestSentLoading: false,
  contacts: [],
  requests: [],
  requestsSent: [],
  countContact: 0,
  countSent: 0,
  countReceived: 0,
};

const contactReducer = (state = initialState, { type, payload }) =>
  produce(state, (draft) => {
    switch (type) {
      case constants.ON_ACCEPT_REQUEST_ADD:
        draft.requestsSent = state.requestsSent.filter(
          (item) => item._id !== payload._id,
        );
        draft.contacts.push(payload);
        draft.countSent = state.countSent - 1;
        draft.countContact = state.countContact + 1;
        break;
      case constants.ON_REMOVE_REQUEST_ADD:
        draft.countSent = state.countSent - 1;
        draft.requestsSent = state.requestsSent.filter(
          (item) => item._id !== payload._id,
        );
        break;
      case constants.ON_CONTACT_REQUEST_ADD:
        let existsRequest = state.requests.filter(
          (item) => item._id === payload.id,
        );
        if (existsRequest.length === 0) {
          draft.requests.push(payload);
          draft.countReceived = state.countReceived + 1;
        }
        break;
      case constants.ON_REMOVE_REQUEST_SENT_ADD:
        draft.countReceived = state.countReceived - 1;
        draft.requests = state.requests.filter(
          (item) => item._id !== payload._id,
        );
        break;
      case constants.ON_REMOVE_CONTACT:
        draft.countContact = state.countContact - 1;
        draft.contacts = state.contacts.filter(
          (item) => item._id !== payload._id,
        );
        break;
      case constants.CONTACT_CREATE_START:
        draft.saveLoading = true;
        draft.error = null;
        break;
      case constants.CONTACT_CREATE_SUCCESS:
        draft.saveLoading = false;
        draft.requestsSent.push(payload);
        draft.countSent = state.countSent + 1;
        draft.error = null;
        break;
      case constants.CONTACT_CREATE_ERROR:
        draft.saveLoading = false;
        draft.error = payload;
        break;
      case constants.CONTACT_REMOVE_CONTACT_START:
      case constants.CONTACT_REMOVE_REQUEST_START:
      case constants.CONTACT_REMOVE_SENT_START:
        draft.deleteLoading = true;
        draft.error = null;
        break;
      case constants.CONTACT_REMOVE_CONTACT_SUCCESS:
        draft.contacts = state.contacts.filter((item) => item._id !== payload);
        draft.countContact = state.countContact - 1;
        draft.error = null;
        break;
      case constants.CONTACT_REMOVE_SENT_SUCCESS:
        draft.deleteLoading = false;
        draft.requestsSent = state.requestsSent.filter(
          (item) => item._id !== payload.contactId,
        );
        draft.countSent = state.countSent - 1;
        draft.error = null;
        break;
      case constants.CONTACT_REMOVE_REQUEST_SUCCESS:
        draft.deleteLoading = false;
        draft.requests = state.requests.filter(
          (item) => item._id !== payload.contactId,
        );
        draft.countReceived = state.countReceived - 1;
        draft.error = null;
        break;
      case constants.CONTACT_REMOVE_REQUEST_ERROR:
      case constants.CONTACT_REMOVE_SENT_ERROR:
        draft.deleteLoading = false;
        draft.error = payload;
        break;
      case constants.CONTACT_GET_START:
        draft.contactLoading = true;
        draft.error = null;
        break;
      case constants.CONTACT_GET_SUCCESS:
        draft.contactLoading = false;
        draft.contacts = payload.contacts;
        draft.requests = payload.requests;
        draft.requestsSent = payload.requestsSent;
        draft.countContact = payload.countContact;
        draft.countSent = payload.countSent;
        draft.countReceived = payload.countReceived;
        draft.error = null;
        break;
      case constants.CONTACT_GET_ERROR:
        draft.contactLoading = false;
        draft.error = payload;
        break;
      case constants.REQUEST_GET_START:
        draft.requestLoading = true;
        draft.error = null;
        break;
      case constants.REQUEST_GET_SUCCESS:
        draft.requestLoading = false;
        draft.requests = payload;
        draft.error = null;
        break;
      case constants.REQUEST_GET_ERROR:
        draft.requestLoading = false;
        draft.error = payload;
        break;
      case constants.REQUEST_SENT_GET_START:
        draft.requestSentLoading = true;
        draft.error = null;
        break;
      case constants.REQUEST_SENT_GET_SUCCESS:
        draft.requestSentLoading = false;
        draft.requestsSent = payload;
        draft.error = null;
        break;
      case constants.REQUEST_SENT_GET_ERROR:
        draft.requestSentLoading = false;
        draft.error = payload;
        break;
      case constants.ACCEPT_CONTACT_START:
        draft.dataLoading = true;
        draft.error = null;
        break;
      case constants.ACCEPT_CONTACT_SUCCESS:
        draft.dataLoading = false;
        draft.contacts.push(payload.userContact);
        draft.requests = state.requests.filter(
          (item) => item._id !== payload.id,
        );
        draft.countReceived = state.countReceived - 1;
        draft.countContact = state.countContact + 1;
        break;
      case constants.ACCEPT_CONTACT_ERROR:
        draft.dataLoading = false;
        draft.error = payload;
        break;
      default:
        break;
    }
  });

export default contactReducer;
