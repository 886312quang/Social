import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { GLOBALTYPES } from "../../../../../store/_actions/globalTypes";
import { deletePost } from "../../../../../store/_actions/post";
import { BASE_URL } from "../../../../../utils/config";
import { Dropdown } from "react-bootstrap";
import userSelectors from "../../../../../store/_selectors/user";
import { formatDistanceToNowStrict } from "date-fns";

const CardHeader = ({ post }) => {
  const { auth, socket } = useSelector((state) => state);
  const dispatch = useDispatch();

  const history = useHistory();

  const currentUser = useSelector(userSelectors.selectCurrentUser);

  const handleEditPost = () => {
    dispatch({ type: GLOBALTYPES.STATUS, payload: { ...post, onEdit: true } });
  };

  const handleDeletePost = () => {
    if (window.confirm("Are you sure want to delete this post?")) {
      dispatch(deletePost({ post, auth, socket }));
      return history.push("/");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${BASE_URL}/post/${post._id}`);
  };

  return (
    /*  <div className="card_header">
            <div className="d-flex">
                <Avatar src={post?.user?.avatar} size="big-avatar" />

                <div className="card_name">
                    <h6 className="m-0">
                        <Link to={`/profile/${post?.user?._id}`} className="text-dark">
                            {post?.user?.username}
                        </Link>
                    </h6>
                    <small className="text-muted">
                        {moment(post?.createdAt).fromNow()}
                    </small>
                </div>
            </div>

            <div className="nav-item dropdown">
                <span className="material-icons" id="moreLink" data-toggle="dropdown">
                    more_horiz
                </span>

                <div className="dropdown-menu">
                    {
                        auth?.user?._id === post?.user?._id &&
                        <>
                            <div className="dropdown-item" onClick={handleEditPost}>
                                <span className="material-icons">create</span> Edit Post
                            </div>
                            <div className="dropdown-item" onClick={handleDeletePost} >
                                <span className="material-icons">delete_outline</span> Remove Post
                            </div>
                        </>
                    }

                    <div className="dropdown-item" onClick={handleCopyLink}>
                        <span className="material-icons">content_copy</span> Copy Link
                    </div>
                </div>
            </div>
        </div> */
    <div className="user-post-data">
      <div className="d-flex justify-content-between">
        <div className="me-3">
          <img
            className="rounded-circle avatar-50"
            src={
              post
                ? process.env.REACT_APP_STATIC_AVATARS +
                  "/" +
                  post?.user?.avatar
                : ""
            }
            alt=""
          />
        </div>
        <div className="w-100">
          <div className="d-flex  justify-content-between">
            <div>
              <h5 className="mb-0 d-inline-block">{post?.user?.userName}</h5>
              <p className="mb-0 text-primary">
                {post?.createdAt
                  ? formatDistanceToNowStrict(new Date(post?.createdAt), {
                      addSuffix: false,
                    })
                  : ""}
              </p>
            </div>
            <div className="card-post-toolbar">
              <Dropdown>
                <Dropdown.Toggle className="bg-transparent border-white">
                  <i className="ri-more-fill"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu m-0 p-0">
                  {currentUser?._id === post?.user?._id && (
                    <Dropdown.Item className=" p-3" onClick={handleEditPost}>
                      <div className="d-flex align-items-top">
                        <div className="h4">
                          <i className="ri-save-line"></i>
                        </div>
                        <div className="data ms-2">
                          <h6>Edit Post</h6>
                          <p className="mb-0">Edit this to your post</p>
                        </div>
                      </div>
                    </Dropdown.Item>
                  )}
                  {currentUser?._id === post?.user?._id && (
                    <Dropdown.Item className="p-3" onClick={handleDeletePost}>
                      <div className="d-flex align-items-top">
                        <i className="ri-close-circle-line h4"></i>
                        <div className="data ms-2">
                          <h6>Remove Post</h6>
                          <p className="mb-0">See fewer posts like this.</p>
                        </div>
                      </div>
                    </Dropdown.Item>
                  )}

                  <Dropdown.Item className=" p-3" onClick={handleCopyLink}>
                    <div className="d-flex align-items-top">
                      <i className="ri-user-unfollow-line h4"></i>
                      <div className="data ms-2">
                        <h6>Unfollow User</h6>
                        <p className="mb-0">
                          Stop seeing posts but stay friends.
                        </p>
                      </div>
                    </div>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardHeader;
