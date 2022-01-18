const { notification } = require("./../services/index");
const NotificationModel = require("../models/notificationModel");

let readMore = async (req, res) => {
  try {
    //Get skip number from query params
    let skipNumberNotification = 0;
    // Read more Notify
    let newNotification = await notification.readMore(
      req.user._id,
      skipNumberNotification
    );

    return res.status(200).send(newNotification);
  } catch (error) {
    return res.status(500).send(error);
  }
};

let markAllAsRead = async (req, res) => {
  try {
    let mark = await notification.markAllAsRead(
      req.user._id,
      req.body.targetUsers
    );
    return res.status(200).send(mark);
  } catch (error) {
    return res.status(500).send(error);
  }
};

let markNotify = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);

    await NotificationModel.model.markNotify(id);
    return res.status(200).send(id);
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  readMore: readMore,
  markAllAsRead: markAllAsRead,
  markNotify: markNotify,
};
