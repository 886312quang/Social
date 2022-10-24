import React, { useState } from "react";
import { Modal, Row } from "antd";
import {
  DeleteOutlined,
  EyeOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import actions from "../../../../store/_actions/message";

function ImageUploadList({ fileList, onDelete }) {
  const dispatch = useDispatch();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    setPreviewImage(file?.url || await getBase64(file.originFileObj));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  return (
    <div
      className="clearfix"
      style={{
        maxHeight: "130px",
        overflowY: "auto",
      }}
    >
      <span className="ant-upload-picture-card-wrapper">
        {fileList.map((file, index) => {
          return (
            <div
              key={index}
              className="ant-upload-list ant-upload-list-picture-card"
            >
              <div className="ant-upload-list-picture-card-container">
                <span>
                  <div
                    className={`ant-upload-list-item ${
                      file.status === "error"
                        ? "ant-upload-list-item-error"
                        : ""
                    } ant-upload-list-item-list-type-picture-card`}
                  >
                    {file.status === "uploading" ? (
                      <Row
                        type="flex"
                        align="middle"
                        justify="center"
                        style={{
                          height: "100%",
                        }}
                      >
                        <LoadingOutlined />
                      </Row>
                    ) : (
                      <>
                        <div className="ant-upload-list-item-info">
                          <span className="ant-upload-list-item-actions"></span>
                          <img
                            className="ant-upload-list-item-thumbnail"
                            src={file.response ? file.response.thumbUrl : ""}
                            alt="image upload"
                          />
                        </div>
                        <span className="ant-upload-list-item-actions">
                          <DeleteOutlined
                            onClick={() =>
                              onDelete(
                                fileList.filter(
                                  (item) => item.uid !== file.uid
                                ),
                                dispatch(
                                  actions.doDeleteList({
                                    fileList,
                                    id: file.uid,
                                    type: "images",
                                  })
                                )
                              )
                            }
                          />
                          <EyeOutlined onClick={() => handlePreview(file)} />
                        </span>
                      </>
                    )}
                  </div>
                </span>
              </div>
            </div>
          );
        })}
      </span>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img
          alt="example"
          style={{
            width: "100%",
          }}
          src={previewImage}
        />
      </Modal>
    </div>
  );
}

export default ImageUploadList;
