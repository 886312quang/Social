import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createComment } from "../../../../../store/_actions/commentAction";
import userSelectors from "../../../../../store/_selectors/user";

const InputComment = ({ children, post, onReply, setOnReply }) => {
  const [content, setContent] = useState("");

  const { auth, socket, theme } = useSelector((state) => state);

  const currentUser = useSelector(userSelectors.selectCurrentUser);

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    if (e.charCode === 13) {
      e.preventDefault();
      if (!content.trim()) {
        if (setOnReply) return setOnReply(false);
        return;
      }

      setContent("");

      const newComment = {
        content,
        likes: [],
        user: currentUser,
        createdAt: new Date().toISOString(),
        reply: onReply && onReply.commentId,
        tag: onReply && onReply.user,
      };

      dispatch(createComment({ post, newComment, currentUser, socket }));

      if (setOnReply) return setOnReply(false);
    }
  };

  return (
    <form
      className="comment-text d-flex align-items-center mt-3"
      onKeyPress={handleSubmit}
    >
      <input
        type="text"
        className="form-control rounded"
        placeholder="Enter Your Comment"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </form>
  );
};

export default InputComment;
