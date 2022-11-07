import { GLOBALTYPES } from "./globalTypes";
import { imageUpload } from "../../utils/imageUpload";
import api from "../../api/api";
import { createNotify, removeNotify } from "./notifyAction";
import notify from "../../components/notifications/notifications";
import { emitLikePost, emitUnlikePost } from "../../sockets/post";

export const POST_TYPES = {
  CREATE_POST: "CREATE_POST",
  LOADING_POST: "LOADING_POST",
  GET_POSTS: "GET_POSTS",
  UPDATE_POST: "UPDATE_POST",
  GET_POST: "GET_POST",
  DELETE_POST: "DELETE_POST",
  UNLIKE_POST: "UNLIKE_POST",
};

export const createPost =
  ({ content, images, auth, socket }) =>
  async (dispatch) => {
    let media = [];
    try {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

      if (images.length > 0) {
        media = await imageUpload(images);
      }

      const res = await api.post("/post", { content, images: media });

      console.log(res.data.newPost);

      dispatch({
        type: POST_TYPES.CREATE_POST,
        payload: { ...res.data.newPost },
      });

      dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
      notify.success("Added a new post success");

      /*  // Notify
      const msg = {
        id: res.data.newPost._id,
        text: "added a new post.",
        recipients: res.data.newPost.user.followers,
        url: `/post/${res.data.newPost._id}`,
        content,
        image: media[0].url,
      };

      dispatch(createNotify({ msg, auth, socket })); */
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err },
      });
    }
  };

export const getPosts = () => async (dispatch) => {
  try {
    dispatch({ type: POST_TYPES.LOADING_POST, payload: true });
    const res = await api.get("/post");
    console.log(res, "res");
    dispatch({
      type: POST_TYPES.GET_POSTS,
      payload: { ...res.data, page: 2 },
    });

    dispatch({ type: POST_TYPES.LOADING_POST, payload: false });
  } catch (err) {
    console.log(err);
    // dispatch({
    //     type: GLOBALTYPES.ALERT,
    //     payload: {error: err.response.data.msg}
    // })
  }
};

export const updatePost =
  ({ content, images, auth, status }) =>
  async (dispatch) => {
    let media = [];
    const imgNewUrl = images.filter((img) => !img.url);
    const imgOldUrl = images.filter((img) => img.url);

    if (
      status.content === content &&
      imgNewUrl.length === 0 &&
      imgOldUrl.length === status.images.length
    )
      return;

    try {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
      if (imgNewUrl.length > 0) media = await imageUpload(imgNewUrl);

      const res = await api.patch(`post/${status._id}`, {
        content,
        images: [...imgOldUrl, ...media],
      });

      dispatch({ type: POST_TYPES.UPDATE_POST, payload: res.data.newPost });

      notify.success(res.data.msg);

      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

export const likePost =
  ({ post, currentUser }) =>
  async (dispatch) => {
    const newPost = { ...post, likes: [...post.likes, currentUser] };
    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });

    try {
      const res = await api.patch(`post/${post._id}/like`, newPost);
      const data = {
        newPost,
        notify: res.data.notify,
      };
      emitLikePost(data);
    } catch (err) {
      notify.error(err);
    }
  };

export const unLikePost =
  ({ post, currentUser }) =>
  async (dispatch) => {
    const newPost = {
      ...post,
      likes: post.likes.filter((like) => like._id !== currentUser._id),
    };
    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });

    try {
      await api.patch(`post/${post._id}/unlike`);

      emitUnlikePost(newPost);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

export const getPost =
  ({ detailPost, id, auth }) =>
  async (dispatch) => {
    try {
      console.log(id);
      const res = await api.get(`post/${id}`);
      console.log("deatai", res.data);
      dispatch({ type: POST_TYPES.GET_POST, payload: res.data.post });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

export const deletePost =
  ({ post, auth, socket }) =>
  async (dispatch) => {
    dispatch({ type: POST_TYPES.DELETE_POST, payload: post });

    try {
      const res = await api.delete(`post/${post._id}`);

      // Notify
      const msg = {
        id: post._id,
        text: "added a new post.",
        recipients: res.data.newPost.user.followers,
        url: `/post/${post._id}`,
      };
      dispatch(removeNotify({ msg, auth, socket }));
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

export const savePost =
  ({ post, auth }) =>
  async (dispatch) => {
    const newUser = { ...auth.user, saved: [...auth.user.saved, post._id] };
    dispatch({ type: GLOBALTYPES.AUTH, payload: { ...auth, user: newUser } });

    try {
      await api.patch(`savePost/${post._id}`, null);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

export const unSavePost =
  ({ post, auth }) =>
  async (dispatch) => {
    const newUser = {
      ...auth.user,
      saved: auth.user.saved.filter((id) => id !== post._id),
    };
    dispatch({ type: GLOBALTYPES.AUTH, payload: { ...auth, user: newUser } });

    try {
      await api.patch(`unSavePost/${post._id}`, null);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };
