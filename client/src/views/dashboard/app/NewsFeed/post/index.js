import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import LoadMoreBtn from "../LoadMoreBtn";
import api from "../../../../../api/api";
import { POST_TYPES } from "../../../../../store/_actions/post";
import postSelectors from "../../../../../store/_selectors/post";

import { Col, Spinner } from "react-bootstrap";
import CardHeader from "./CardHeader";
import CardBody from "./CardBody";
import Comment from "./Comments";
import InputComment from "./InputComment";

const Posts = () => {
  const { post } = useSelector((state) => state);
  const dispatch = useDispatch();

  const posts = useSelector(postSelectors.getPosts);

  const [load, setLoad] = useState(false);

  const handleLoadMore = async () => {
    setLoad(true);
    const res = await api.get(`/post?limit=${post.page * 9}`);

    dispatch({
      type: POST_TYPES.GET_POSTS,
      payload: { ...res.data, page: post.page + 1 },
    });

    setLoad(false);
  };

  return (
    <>
      {posts?.map((post) => (
        <Col sm={12} key={post?._id}>
          <div className="card card-block card-stretch card-height">
            <div className="card-body">
              <CardHeader post={post} />
              <CardBody post={post} />
              <hr />
              <Comment post={post} />
              <InputComment post={post} />
            </div>
          </div>
        </Col>
      ))}

      {load && <Spinner />}

      <LoadMoreBtn
        result={post?.result}
        page={post?.page}
        load={load}
        handleLoadMore={handleLoadMore}
      />
    </>
  );
};

export default Posts;
