import React, { useState, useEffect } from "react";
import CommentCard from "./CommentCard";

const CommentDisplay = ({ comment, post, replyCm }) => {
  const [showRep, setShowRep] = useState([]);
  const [next, setNext] = useState(1);

  useEffect(() => {
    setShowRep(replyCm.slice(replyCm.length - next));
  }, [replyCm, next]);

  return (
    <>
      <CommentCard comment={comment} post={post} commentId={comment._id}>
        <div style={{ paddingLeft: "20px" }}>
          {showRep.map(
            (item, index) =>
              item.reply && (
                <CommentCard
                  key={index}
                  comment={item}
                  post={post}
                  commentId={comment._id}
                />
              )
          )}

          {replyCm.length - next > 0 ? (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => setNext(next + 10)}
            >
              <i className="ri-arrow-right-s-line iq-arrow-right"></i>
              See more comments...
            </div>
          ) : (
            replyCm.length > 1 && (
              <div style={{ cursor: "pointer" }} onClick={() => setNext(1)}>
                <i className="ri-arrow-left-s-line iq-arrow-right"></i>
                Hide comments...
              </div>
            )
          )}
        </div>
      </CommentCard>
    </>
  );
};

export default CommentDisplay;
