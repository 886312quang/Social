const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const configApp = require("../config/app");

module.exports = {
  storage: new multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, configApp.attachment_message_directory);
    },
    filename: (req, file, callback) => {
      const fileTypes = /pdf|docx|xlsx|csv|txt/;
      // let mimetype = fileTypes.test(file.mimetype);
      let extname = fileTypes.test(
        path.extname(file.originalname).toLowerCase(),
      );
      if (extname) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const fileName = uniqueSuffix + "-" + file.originalname;
        return callback(null, fileName);
      }
      callback(
        `File upload only supports the following filetypes - ` + fileTypes,
        null,
      );
    },
  }),
  limits: { fileSize: configApp.attachmentMessage_limit_size },
};
