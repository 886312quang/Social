const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const configApp = require("../config/app");

module.exports = {
  storage: new multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, configApp.images_message_directory);
    },
    filename: (req, file, callback) => {
      console.log("file", file)
      let math = configApp.imageMessage_type;
      if (math.indexOf(file.mimetype) === -1) {
        return callback("Only .png, .jpg and .jpeg format allowed!", null);
      }
      let imageName = `${Date.now()}-${uuidv4()}`;
      //   .${file.originalname.split(".").pop()}
      callback(null, imageName);
    },
  }),
  limits: { fileSize: configApp.imageMessage_limit_size },
};
