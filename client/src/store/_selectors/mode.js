import { createSelector } from "reselect";

const selectRaw = (state) => state.mode;

const getDarkMode = createSelector(
    [selectRaw],
    (mode) => mode.initLoading,
);

const getRtlMode = createSelector(
    [selectRaw],
    (mode) => mode.rtl,
);

const selectors = {
    getDarkMode,
    getRtlMode,
};

export default selectors;