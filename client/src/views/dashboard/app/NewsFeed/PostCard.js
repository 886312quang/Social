import React from "react";
import CardHeader from "./post/CardHeader";
import CardBody from "./post/CardBody";
import CardFooter from "./post/CardFooter";

import Comments from "./post/Comments";
import InputComment from "./post/InputComment";

const PostCard = ({ post, theme }) => {
  return (
    <div className="card my-3">
      <CardHeader post={post} />
      <CardBody post={post} theme={theme} />
      <hr />

      <Comments post={post} />
      <InputComment post={post} />
    </div>
  );
};

export default PostCard;
