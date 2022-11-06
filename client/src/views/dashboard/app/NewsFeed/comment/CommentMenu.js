import React from "react";
import { Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomToggle from "../../../../../components/dropdowns";
import { deleteComment } from "../../../../../store/_actions/commentAction";
import userSelectors from "../../../../../store/_selectors/user";

const CommentMenu = ({ post, comment, setOnEdit }) => {
  const { auth, socket } = useSelector((state) => state);
  const dispatch = useDispatch();
  const currentUser = useSelector(userSelectors.selectCurrentUser);

  const handleRemove = () => {
    if (
      post.user._id === currentUser._id ||
      comment.user._id === currentUser._id
    ) {
      dispatch(deleteComment({ post, auth, comment, socket }));
    }
  };

  const MenuItem = () => {
    return (
      <>
        <div className="dropdown-item" onClick={() => setOnEdit(true)}>
          Edit
        </div>
        <div className="dropdown-item" onClick={handleRemove}>
          Remove
        </div>
      </>
    );
  };

  return (
    <div className="menu">
      {(post.user._id === currentUser._id ||
        comment.user._id === currentUser._id) && (
        <Dropdown>
          <Dropdown.Toggle as={CustomToggle} id="post-option">
            <i className="ri-more-fill"></i>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {post.user._id === currentUser._id ? (
              comment.user._id === currentUser._id ? (
                MenuItem()
              ) : (
                <Dropdown.Item onClick={handleRemove}>Remove</Dropdown.Item>
              )
            ) : (
              comment.user._id === currentUser._id && MenuItem()
            )}
          </Dropdown.Menu>
        </Dropdown>
      )}
    </div>
  );
};

export default CommentMenu;
