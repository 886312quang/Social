import React, { useState } from "react";
import { Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import CustomToggle from "../../../../../components/dropdowns";
import ShareOffcanvas from "../../../../../components/share-offcanvas";
import Carousel from "../../Carousel";
import icon1 from "../../../../../assets/images/icon/01.png";
import like from "../../../../../assets/images/icon/like.png";
import { BASE_URL } from "../../../../../utils/config";
import LikeButton from "../LikeButton";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { likePost, unLikePost } from "../../../../../store/_actions/post";
import userSelectors from "../../../../../store/_selectors/user";

const CardBody = ({ post }) => {
  const [readMore, setReadMore] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [loadLike, setLoadLike] = useState(false);

  const dispatch = useDispatch();

  const currentUser = useSelector(userSelectors.selectCurrentUser);

  const [saved, setSaved] = useState(false);
  const [saveLoad, setSaveLoad] = useState(false);

  // Likes
  useEffect(() => {
    if (post?.likes?.find((like) => like?._id === currentUser?._id)) {
      setIsLike(true);
    } else {
      setIsLike(false);
    }
  }, [post?.likes, currentUser?._id]);

  const handleLike = async () => {
    if (loadLike) return;

    setLoadLike(true);
    await dispatch(likePost({ post, currentUser }));
    setLoadLike(false);
  };

  const handleUnLike = async () => {
    if (loadLike) return;

    setLoadLike(true);
    await dispatch(unLikePost({ post, currentUser }));
    setLoadLike(false);
  };

  return (
    <div className="user-post">
      <div className="mt-3">
        {post?.content?.length > 60 && (
          <span className="readMore" onClick={() => setReadMore(!readMore)}>
            {readMore ? "Hide content" : "Read more"}
          </span>
        )}
      </div>
      <div className="card_body">
        <div className="card_body-content">
          <span>
            {post?.content?.length < 60
              ? post?.content
              : readMore
              ? post?.content + " "
              : post?.content?.slice(0, 60) + "....."}
          </span>
          {post?.content?.length > 60 && (
            <span className="readMore" onClick={() => setReadMore(!readMore)}>
              {readMore ? "Hide content" : "Read more"}
            </span>
          )}
        </div>
        {post?.images?.length > 0 && (
          <Carousel images={post?.images} id={post?._id} />
        )}
      </div>
      <div className="comment-area mt-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div className="like-block position-relative d-flex align-items-center">
            <div className="d-flex align-items-center">
              <div className="like-data">
                <LikeButton
                  isLike={isLike}
                  handleLike={handleLike}
                  handleUnLike={handleUnLike}
                />
              </div>
              <div className="total-like-block ms-2 me-3">
                <Dropdown>
                  <Dropdown.Toggle as={CustomToggle} id="post-option">
                    {post?.likes?.length} Likes
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {post?.likes?.map((item) => (
                      <Dropdown.Item>{item?.userName}</Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
            <div className="total-comment-block">
              {post?.comments?.length} Comment
            </div>
          </div>
          <ShareOffcanvas url={`${BASE_URL}/post/${post?._id}`} />
        </div>
      </div>
    </div>
  );
};

export default CardBody;
