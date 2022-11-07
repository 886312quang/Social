import { createSelector } from "reselect";

const selectRaw = (state) => state.post;

const getPosts = createSelector(
    [selectRaw],
    (post) => post.posts,
);

const getPost = createSelector(
    [selectRaw],
    (post) => post.post,
);

const selectors = {
    getPosts,
    getPost
};

export default selectors;