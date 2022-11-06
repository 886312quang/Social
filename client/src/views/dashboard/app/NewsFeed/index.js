import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getPost } from "../../../../store/_actions/post";
import PostCard from "./PostCard";
import { POST_TYPES } from "../../../../store/_actions/post";
import postSelectors from "../../../../store/_selectors/post";
import { Col, Container, Row } from "react-bootstrap";
import CardHeader from "./post/CardHeader";
import CardBody from "./post/CardBody";
import Comment from "./post/Comments";
import InputComment from "./post/InputComment";
const Post = () => {
  const { id } = useParams();
  const [postShow, setPostShow] = useState([]);

  const dispatch = useDispatch();

  const post = useSelector(postSelectors.getPost);
  console.log(post);

  useEffect(() => {
    dispatch(getPost({ postShow, id }));
    setPostShow(post);
  }, [id]);

  return (
    <Container>
      <Row>
        <Col lg={8} className="row m-0 p-0">
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
        </Col>
      </Row>
    </Container>
  );
};

export default Post;
