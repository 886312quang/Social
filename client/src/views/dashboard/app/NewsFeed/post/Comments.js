import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomToggle from "../../../../../components/dropdowns";
import CommentDisplay from "../comment/CommentDisplay";
import userSelectors from "../../../../../store/_selectors/user";

const Comments = ({ post }) => {
  const dispatch = useDispatch();

  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState([]);
  const [next, setNext] = useState(2);

  const [replyComments, setReplyComments] = useState([]);

  const currentUser = useSelector(userSelectors.selectCurrentUser);

  useEffect(() => {
    const newCm = post?.comments?.filter((cm) => !cm.reply);
    setComments(newCm);
    setShowComments(newCm?.slice(newCm.length - next));
  }, [post?.comments, next]);

  useEffect(() => {
    const newRep = post?.comments?.filter((cm) => cm.reply);
    setReplyComments(newRep);
  }, [post?.comments]);

  return (
    <div className="comment-area mt-3">
      {showComments?.map((comment, index) => (
        <CommentDisplay
          key={index}
          comment={comment}
          post={post}
          replyCm={replyComments?.filter((item) => item.reply === comment._id)}
        />
      ))}

      {comments?.length - next > 0 ? (
        <div
          className="p-2 border-top"
          style={{ cursor: "pointer" }}
          onClick={() => setNext(next + 10)}
        >
          <i className="ri-arrow-right-s-line iq-arrow-right"></i>
          See more comments...
        </div>
      ) : (
        comments?.length > 2 && (
          <div
            className="p-2 border-top"
            style={{ cursor: "pointer" }}
            onClick={() => setNext(2)}
          >
            <i className="ri-arrow-left-s-line iq-arrow-right"></i>
            Hide comments...
          </div>
        )
      )}
    </div>
  );
};

export default Comments;
