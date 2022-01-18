const NotificationModel = require("./../models/notificationModel");
const UserModel = require("./../models/userModel");

const LIMIT_NUMBER_TAKEN = 10;
/**
 * Get notification when reload limit 10 item.
 * @param {string} currentUserId
 */
let getNotifications = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let notifications = await NotificationModel.model.getByUserIdAndLimit(
        currentUserId,
        LIMIT_NUMBER_TAKEN
      );
      let getNotificationContent = notifications.map(async (notification) => {
        // Return array Sender send notify
        let sender = await UserModel.getNormalUserDataById(
          notification.senderId
        );
        return NotificationModel.contents.getContent(
          notification.type,
          notification.isRead,
          sender._id,
          sender.userName,
          sender.avatar,
          notification.createdAt
        );
      });
      resolve(await Promise.all(getNotificationContent));
    } catch (error) {
      reject(error);
    }
  });
};
/**
 * //Count all notify Unread
 * @param {string} currentUserId
 */
let countNotifyUnread = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let notificationUnread = await NotificationModel.model.countNotifyUnread(
        currentUserId
      );
      resolve(notificationUnread);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Read more notification max 10 notify one time
 * @param {string} currentUserId
 * @param {number} skipNumberNotification
 */
let readMore = (currentUserId, skipNumberNotification) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newNotification = await NotificationModel.model.readMore(
        currentUserId,
        skipNumberNotification,
        LIMIT_NUMBER_TAKEN
      );
      let getNotificationContent = newNotification.map(async (notification) => {
        // Return array Sender send notify
        let sender = await UserModel.getNormalUserDataById(
          notification.senderId
        );

        return NotificationModel.contents.getContent(
          notification._id,
          notification.type,
          notification.isRead,
          sender._id,
          sender.userName,
          sender.avatar,
          notification.createdAt,
          notification.link,
          notification.type,
        );
      });
      resolve(await Promise.all(getNotificationContent));
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Read all notify
 * @param {string} currenUserId
 * @param {string} targetUsers
 */
let markAllAsRead = (currentUserId, targetUsers) => {
  return new Promise(async (resolve, reject) => {
    try {
      await NotificationModel.model.markAllAsRead(currentUserId, targetUsers);
      resolve(true);
    } catch (error) {
      console.log(`error when mark notification as read`);
      reject(false);
    }
  });
};

module.exports = {
  getNotifications: getNotifications,
  countNotifyUnread: countNotifyUnread,
  readMore: readMore,
  markAllAsRead: markAllAsRead,
};
