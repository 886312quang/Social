import React, { useState } from "react";
import { Offcanvas } from "react-bootstrap";

// img
import icon8 from "../assets/images/icon/08.png";
import icon9 from "../assets/images/icon/09.png";
import icon10 from "../assets/images/icon/10.png";
import icon11 from "../assets/images/icon/11.png";
import icon12 from "../assets/images/icon/12.png";
import icon13 from "../assets/images/icon/13.png";
import { Link } from "react-router-dom";
import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  TelegramShareButton,
  TelegramIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  RedditShareButton,
  RedditIcon,
} from "react-share";

const ShareOffcanvas = ({ url }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="d-flex align-items-center feather-icon mt-2 mt-md-0">
        <Link to="#" onClick={handleShow}>
          <i className="ri-share-line"></i>
          <span className="ms-1">Share</span>
        </Link>
      </div>
      <Offcanvas show={show} onHide={handleClose} placement="bottom">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Share</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="d-flex flex-wrap align-items-center">
            <FacebookShareButton url={url}>
              <FacebookIcon round={true} size={32} />
            </FacebookShareButton>

            <TwitterShareButton url={url}>
              <TwitterIcon round={true} size={32} />
            </TwitterShareButton>

            <EmailShareButton url={url}>
              <EmailIcon round={true} size={32} />
            </EmailShareButton>

            <RedditShareButton url={url}>
              <RedditIcon round={true} size={32} />
            </RedditShareButton>

            <TelegramShareButton url={url}>
              <TelegramIcon round={true} size={32} />
            </TelegramShareButton>

            <WhatsappShareButton url={url}>
              <WhatsappIcon round={true} size={32} />
            </WhatsappShareButton>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
export default ShareOffcanvas;
