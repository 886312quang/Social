import React, { useState, useEffect } from "react";
import Avatar from "../../Avatar";
import { Link } from "react-router-dom";
import moment from "moment";

import LikeButton from "../LikeButton";
import { useSelector, useDispatch } from "react-redux";
import CommentMenu from "./CommentMenu";
import {
  updateComment,
  likeComment,
  unLikeComment,
} from "../../../../../store/_actions/commentAction";
import InputComment from "../post/InputComment";
import userSelectors from "../../../../../store/_selectors/user";

const CommentCard = ({ children, comment, post, commentId }) => {
  const { auth, theme } = useSelector((state) => state);
  const currentUser = useSelector(userSelectors.selectCurrentUser);

  const dispatch = useDispatch();

  const [content, setContent] = useState("");
  const [readMore, setReadMore] = useState(false);

  const [onEdit, setOnEdit] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [loadLike, setLoadLike] = useState(false);

  const [onReply, setOnReply] = useState(false);

  useEffect(() => {
    setContent(comment.content);
    setIsLike(false);
    setOnReply(false);
    if (comment.likes.find((like) => like._id === currentUser._id)) {
      setIsLike(true);
    }
  }, [comment, currentUser._id]);

  const handleUpdate = (e) => {
    if (e.charCode === 13) {
      e.preventDefault();
    }
    if (comment.content !== content) {
      dispatch(updateComment({ comment, post, content, auth }));
      setOnEdit(false);
    } else {
      setOnEdit(false);
    }
  };

  const handleReply = () => {
    if (onReply) return setOnReply(false);
    setOnReply({ ...comment, commentId });
  };

  const styleCard = {
    width: "100%",
    opacity: comment._id ? 1 : 0.5,
    pointerEvents: comment._id ? "inherit" : "none",
  };

  return (
    <div className="comment_card mt-2" style={styleCard}>
      <div className="d-flex" style={{ width: "100%", flexBasis: 1 }}>
        <div className="user-img">
          <Link
            to={`/profile/${comment.user._id}`}
            className="d-flex text-dark"
          >
            <img
              src={
                comment?.user?.avatar
                  ? process.env.REACT_APP_STATIC_AVATARS +
                    "/" +
                    comment.user?.avatar
                  : ""
              }
              alt="user1"
              className="avatar-35 rounded-circle img-fluid"
            />
          </Link>
        </div>
        <div className="flex-fill">
          <div className="comment-data-block ms-3">
            <h6>{comment?.user?.userName}</h6>
            <p className="mb-0">
              {onEdit ? (
                <form
                  className="comment-text d-flex align-items-center mt-3"
                  onKeyPress={handleUpdate}
                >
                  <input
                    type="text"
                    className="form-control rounded"
                    placeholder="Enter Your Comment"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </form>
              ) : (
                <div>
                  {comment.tag && comment.tag._id !== comment.user._id && (
                    <Link to={`/profile/${comment.tag._id}`} className="mr-1">
                      @{comment.tag.userName}
                    </Link>
                  )}
                  <span>
                    {content.length < 100
                      ? content
                      : readMore
                      ? content + " "
                      : content.slice(0, 100) + "...."}
                  </span>
                  {content.length > 100 && (
                    <span
                      className="readMore"
                      onClick={() => setReadMore(!readMore)}
                    >
                      {readMore ? "Hide content" : "Read more"}
                    </span>
                  )}
                </div>
              )}
            </p>
            <div
              className="d-flex flex-row"
              style={{
                justifyContent: "space-between",
                cursor: "pointer",
              }}
            >
              <div>
                {onEdit ? (
                  <div>
                    <span
                      style={{ color: "#69C6FF" }}
                      className="font-weight-bold mr-3"
                      onClick={handleUpdate}
                    >
                      Update
                    </span>
                    <span
                      style={{ marginLeft: "8px" }}
                      className="font-weight-bold mr-3"
                      onClick={() => setOnEdit(false)}
                    >
                      Cancel
                    </span>
                  </div>
                ) : (
                  <span
                    style={{ cursor: "pointer", color: "#69C6FF" }}
                    className="font-weight-bold mr-3"
                    onClick={handleReply}
                  >
                    {onReply ? "Cancel" : "Reply"}
                  </span>
                )}
                <span style={{ marginLeft: "8px" }}>
                  {moment(comment.createdAt).fromNow()}
                </span>
              </div>

              <div
                className="d-flex align-items-center mx-2"
                style={{ cursor: "pointer" }}
              >
                <CommentMenu
                  post={post}
                  comment={comment}
                  setOnEdit={setOnEdit}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {onReply && (
        <div style={{ paddingLeft: "20px" }}>
          <InputComment post={post} onReply={onReply} setOnReply={setOnReply}>
            <Link to={`/profile/${onReply.user._id}`} className="mr-1">
              @{onReply.user.userName}:
            </Link>
          </InputComment>
        </div>
      )}

      {children}
    </div>
  );
};

export default CommentCard;
