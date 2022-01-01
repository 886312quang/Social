import { createSelector } from "reselect";

const selectRaw = (state) => state.contact;

const selectInitLoading = createSelector(
  [selectRaw],
  (contact) => contact.initLoading,
);

const selectSaveLoading = createSelector(
  [selectRaw],
  (contact) => contact.saveLoading,
);

const selectDestroyLoading = createSelector(
  [selectRaw],
  (contact) => contact.destroyLoading,
); /*  */

const selectFindLoading = createSelector(
  [selectRaw],
  (contact) => contact.findLoading,
);

const selectErrorMessage = createSelector(
  [selectRaw],
  (contact) => contact.error,
);

const selectContacts = createSelector(
  [selectRaw],
  (contact) => contact.contacts,
);
const selectRequests = createSelector(
  [selectRaw],
  (contact) => contact.requests,
);
const selectRequestsSent = createSelector(
  [selectRaw],
  (contact) => contact.requestsSent,
);

const selectCountContact = createSelector(
  [selectRaw],
  (contact) => contact.countContact,
);
const selectCountSent = createSelector(
  [selectRaw],
  (contact) => contact.countSent,
);
const selectCountReceived = createSelector(
  [selectRaw],
  (contact) => contact.countReceived,
);

const selectRecord = createSelector([selectRaw], (contact) => contact.record);

const selectors = {
  selectInitLoading,
  selectSaveLoading,
  selectErrorMessage,
  selectContacts,
  selectRequests,
  selectRequestsSent,
  selectDestroyLoading,
  selectRecord,
  selectFindLoading,
  selectCountContact,
  selectCountSent,
  selectCountReceived,
};

export default selectors;
