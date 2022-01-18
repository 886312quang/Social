import { createSelector } from "reselect";

const selectRaw = (state) => state.notify;

const selectInitLoading = createSelector(
  [selectRaw],
  (notify) => notify.initLoading,
);

const selectFindLoading = createSelector(
  [selectRaw],
  (notify) => notify.findLoading,
);

const selectErrorMessage = createSelector(
  [selectRaw],
  (notify) => notify.error,
);

const selectNotifys = createSelector(
  [selectRaw],
  (notify) => notify.notifys,
);

const selectCountNotify = createSelector(
  [selectRaw],
  (notify) => notify.countNotify,
);

const selectRecord = createSelector([selectRaw], (notify) => notify.record);

const selectors = {
  selectInitLoading,
  selectErrorMessage,
  selectNotifys,
  selectRecord,
  selectFindLoading,
  selectCountNotify,
};

export default selectors;
