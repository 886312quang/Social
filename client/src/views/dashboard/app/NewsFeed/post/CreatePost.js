import React, { useEffect } from "react";
import { useState, useRef } from "react";
import { Button, Card, Dropdown, Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import CustomToggle from "../../../../../components/dropdowns";
import userSelectors from "../../../../../store/_selectors/user";
import { GLOBALTYPES } from "../../../../../store/_actions/globalTypes";
import { createPost, updatePost } from "../../../../../store/_actions/post";
import Icons from "../Icons";
import { imageShow, videoShow } from "../../../../../utils/mediaShow";

export default function CreatePost() {
  const [show, setShow] = useState(false);
  const { auth, theme, status, socket } = useSelector((state) => state);
  const currentUser = useSelector(userSelectors.selectCurrentUser);

  const dispatch = useDispatch();

  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);

  const [stream, setStream] = useState(false);
  const videoRef = useRef();
  const refCanvas = useRef();
  const [tracks, setTracks] = useState("");

  const handleChangeImages = (e) => {
    const files = [...e.target.files];
    let err = "";
    let newImages = [];

    files.forEach((file) => {
      if (!file) return (err = "File does not exist.");

      if (file.size > 1024 * 1024 * 5) {
        return (err = "The image/video largest is 5mb.");
      }

      return newImages.push(file);
    });

    if (err) dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } });
    setImages([...images, ...newImages]);
  };

  const deleteImages = (index) => {
    const newArr = [...images];
    newArr.splice(index, 1);
    setImages(newArr);
  };

  const handleStream = () => {
    setStream(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((mediaStream) => {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();

          const track = mediaStream.getTracks();
          setTracks(track[0]);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleCapture = () => {
    const width = videoRef.current.clientWidth;
    const height = videoRef.current.clientHeight;

    refCanvas.current.setAttribute("width", width);
    refCanvas.current.setAttribute("height", height);

    const ctx = refCanvas.current.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, width, height);
    let URL = refCanvas.current.toDataURL();

    setImages([...images, { camera: URL }]);
    console.log(images);
  };

  const handleStopStream = () => {
    tracks.stop();
    setStream(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // if(images.length === 0)
    // return dispatch({
    //     type: GLOBALTYPES.ALERT, payload: {error: "Please add your photo."}
    // })

    if (status?.onEdit) {
      dispatch(updatePost({ content, images, auth, status }));
    } else {
      dispatch(createPost({ content, images, auth, socket }));
    }
    setShow(false);
    setContent("");
    setImages([]);
  };

  useEffect(() => {
    if (status?.onEdit) {
      setContent(status?.content);
      setImages(status?.images);
      setShow(true);
    }
  }, [status]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Card id="post-modal-data" className="card-block card-stretch card-height">
      <div className="card-header d-flex justify-content-between">
        <div className="header-title">
          <h4 className="card-title">Create Post</h4>
        </div>
      </div>
      <Card.Body>
        <div className="d-flex align-items-center">
          <div className="user-img">
            <img
              src={
                currentUser
                  ? process.env.REACT_APP_STATIC_AVATARS +
                    "/" +
                    currentUser.avatar
                  : ""
              }
              alt="user1"
              className="avatar-60 rounded-circle"
            />
          </div>
          <form className="post-text ms-3 w-100 " onClick={handleShow}>
            <input
              type="text"
              className="form-control rounded"
              placeholder="Write something here..."
              style={{ border: "none" }}
            />
          </form>
        </div>
        <hr />
        <ul className=" post-opt-block d-flex list-inline m-0 p-0 flex-wrap">
          <li className="me-3 mb-md-0 mb-2">
            <Link to="#" className="btn btn-soft-primary">
              {" "}
              Photo/Video
            </Link>
          </li>
          <li className="me-3 mb-md-0 mb-2">
            <Link to="#" className="btn btn-soft-primary">
              {" "}
              Tag Friend
            </Link>
          </li>
          <li className="me-3">
            <Link to="#" className="btn btn-soft-primary">
              {" "}
              Feeling/Activity
            </Link>
          </li>
          <li>
            <button className=" btn btn-soft-primary">
              <div className="card-header-toolbar d-flex align-items-center">
                <Dropdown>
                  <Dropdown.Toggle as="div">
                    <i className="ri-more-fill h4"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={handleShow} href="#">
                      Check in
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleShow} href="#">
                      Live Video
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleShow} href="#">
                      Gif
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleShow} href="#">
                      Watch Party
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleShow} href="#">
                      Play with Friend
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </button>
          </li>
        </ul>
      </Card.Body>

      {show && (
        <Modal size="lg" id="post-modal" onHide={handleClose} show={show}>
          <Modal.Header className="d-flex justify-content-between" closeButton>
            <Modal.Title id="post-modalLabel">Create Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex align-items-center">
              <div className="user-img">
                <img
                  src={
                    currentUser
                      ? process.env.REACT_APP_STATIC_AVATARS +
                        "/" +
                        currentUser.avatar
                      : ""
                  }
                  alt="user1"
                  className="avatar-60 rounded-circle img-fluid"
                />
              </div>
              <form
                className="post-text ms-3 w-100 "
                data-bs-toggle="modal"
                data-bs-target="#post-modal"
              >
                <input
                  type="text"
                  name="content"
                  className="form-control rounded"
                  value={content}
                  placeholder={`${currentUser?.userName}, what are you thinking?`}
                  onChange={(e) => setContent(e.target.value)}
                  style={{ border: "none" }}
                />
              </form>
            </div>
            <hr />
            <div className="show_images">
              {images.map((img, index) => (
                <div key={index} id="file_img">
                  {img.camera ? (
                    imageShow(img.camera, theme)
                  ) : img.url ? (
                    <>
                      {img.url.match(/video/i)
                        ? videoShow(img.url, theme)
                        : imageShow(img.url, theme)}
                    </>
                  ) : (
                    <>
                      {img.type.match(/video/i)
                        ? videoShow(URL.createObjectURL(img), theme)
                        : imageShow(URL.createObjectURL(img), theme)}
                    </>
                  )}
                  <span onClick={() => deleteImages(index)}>&times;</span>
                </div>
              ))}
            </div>
            <div className="input_images">
              {stream ? (
                <i className="fas fa-camera" onClick={handleCapture} />
              ) : (
                <>
                  <div className="file_upload">
                    <input
                      type="file"
                      name="file"
                      id="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleChangeImages}
                    />
                  </div>
                </>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="btn btn-primary d-block w-100 mt-3"
              onClick={handleSubmit}
            >
              Post
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Card>
  );
}
