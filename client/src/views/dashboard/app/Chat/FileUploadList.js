import React from "react";
import { DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import actions from "../../../../store/_actions/message";

function FileUploadList({ fileList, onDelete }) {
  const dispatch = useDispatch();

  return (
    <div
      className="clearfix"
      style={{
        maxHeight: "130px",
        overflowY: "auto",
      }}
    >
      <span className="ant-upload-list ant-upload-list-text">
        {fileList.map((file, index) => {
          return (
            <div
              key={index}
              className={`ant-upload-list-item ${
                file.status === "error"
                  ? "ant-upload-list-item-error"
                  : "ant-upload-list-item-done"
              } ant-upload-list-item-list-type-text`}
            >
              <span>
                <div className="ant-upload-list-item-info">
                  <span>
                    {file.status === "uploading" ? <LoadingOutlined /> : null}

                    <span className="ant-upload-list-item-name ant-upload-list-item-name-icon-count-1">
                      {file.name}
                    </span>
                    <span className="ant-upload-list-item-card-actions">
                      <DeleteOutlined
                        onClick={() =>
                          onDelete(
                            fileList.filter((item) => item.uid !== file.uid),
                            dispatch(
                              actions.doDeleteList({
                                fileList,
                                id: file.uid,
                                type: "files",
                              })
                            )
                          )
                        }
                      />
                    </span>
                  </span>
                </div>
              </span>
            </div>
          );
        })}
      </span>
    </div>
  );
}

export default FileUploadList;
